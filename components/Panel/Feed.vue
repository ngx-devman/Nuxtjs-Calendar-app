<script lang="ts">
import { ArticlesFetchAction } from '@store/articles'
import { EventsFetchAction } from '@store/events'
import { PostsFetchAction } from '@store/posts'
import _ from 'lodash'
import {
	Vue,
	Component,
	Watch,
	Action,
	Prop,
	PropSync,
	Getter
} from 'nuxt-property-decorator'
import { CancelTokenSource } from 'axios'

@Component
export default class PanelNewsEvents extends Vue {
	@Prop({ type: [Object, Boolean], default: false })
	filters!: any

	@PropSync('tab', { required: true }) selected!: string
	@PropSync('location') dlocation!: number | false

	@Action('events/fetch') fetchEvents!: EventsFetchAction
	@Action('posts/fetch') fetchPosts!: PostsFetchAction
	@Action('articles/fetch') fetchArticles!: ArticlesFetchAction

	@Getter('auth/favorite_events') favorite_events!: number[]
	@Getter('locations/items') locations!: any[]
	@Getter('categories/items') categories!: any[]
	@Getter('categories/event_types') eventTypes!: any[]

	tabs = ['News', 'Events']

	page: number = 1
	events: any[] = []
	articles: any[] = []
	posts: any[] = []

	apiRequest: CancelTokenSource | false = false
	cancelAndRefetch(reason: string = 'no reason', replace: boolean = true) {
		clearTimeout(this.fetchError)
		this.fetchingItems = false

		if (this.apiRequest) {
			this.apiRequest.cancel(reason)
			this.apiRequest = false
		}

		this.fetchItems(replace)
	}

	resetScroll() {
		if (this.$refs.feed && this.$refs.feed instanceof HTMLElement) {
			this.$refs.feed.scrollTop = 0
		}
	}

	mounted() {
		this.fetchItems()
	}

	@Watch('selected')
	tabChanged() {
		this.cancelAndRefetch('tab changed')
	}

	@Watch('filters')
	filtersChanged() {
		this.cancelAndRefetch('filters changed')
	}

	@Getter('favoritesFeed') favoritesFeed!: boolean
	@Watch('favoritesFeed')
	refetchOnFavoritesUpdate() {
		this.cancelAndRefetch('user selected favs')
	}

	fetchError: any = false
	fetchingItems: boolean = false
	fetchItems(replace: boolean = true) {
		if (this.fetchingItems) return Promise.reject(new Error('fetching'))
		this.fetchingItems = true

		if (replace) this.page = 1

		const filters = Object.assign(this.filters, { page: this.page })
		const handleError = (err: any) => {
			console.error('failed fetching items', err)
			this.fetchError = setTimeout(() => {
				this.fetchingItems = false
			}, 5000)

			throw err
		}

		this.apiRequest = this.$api.CancelToken.source()
		switch (this.selected) {
			case 'Events':
				return this.fetchEvents(filters)
					.then(events => {
						if (replace) {
							this.events = events
							this.$nextTick().then(() => this.resetScroll())
						} else {
							this.events.push(...events)
						}

						this.fetchingItems = false
					})
					.catch(handleError)

			case 'News':
				return this.fetchPosts(filters)
					.then(posts => {
						if (replace) {
							this.posts = posts.data

							this.$nextTick().then(() => this.resetScroll())
						} else {
							this.posts.push(...posts.data)
						}

						this.fetchingItems = false
					})
					.catch(handleError)
		}

		return Promise.reject(new Error('unknown fetch option'))
	}

	nextPage(throwIt: boolean = false) {
		if (this.fetchingItems) return false

		this.page += 1
		return this.fetchItems(false).catch(() => {
			this.page -= 1
			if (throwIt) throw new Error('no items')
		})
	}

	get filteredStartDate() {
		return this.$moment(this.filters.start_date)
	}

	get filteredEndDate() {
		return this.$moment(this.filters.end_date)
	}

	get startDateFormat() {
		if (!this.filters.start_date) return false
		return this.filteredStartDate.format('MMMM D')
	}

	get endDateFormat() {
		if (!this.filters.end_date) return false
		return this.filteredEndDate.format('MMMM D')
	}

	get locationTitle() {
		if (!this.filters || !this.filters.locations) return ''
		const locationIds = this.filters.locations
		const locs = this.locations
			.filter((l: any) => locationIds.includes(l.id))
			.map((c: any) => {
				if (!c || !c.title) return false
				if (c.title.length > 20) {
					const regex = /^\w*/gm // first word
					const firstWord = regex.exec(c.title)
					return firstWord ? firstWord[0] : false
				} else return c.title
			})
			.filter((i: any) => i)
			.join(' + ')
		return locs
	}

	get categoryTitle() {
		if (!this.filters || !this.filters.categories) return ''
		const catIds = this.filters.categories
		const cats = this.categories
			.filter((cat: any) => catIds.includes(cat.id))
			.map((c: any) => {
				if (!c || !c.title) return false
				if (c.title.length > 20) {
					const regex = /^\w*/gm // first word
					const firstWord = regex.exec(c.title)
					return firstWord ? firstWord[0] : false
				} else return c.title
			})
			.filter((i: any) => i)
			.join(' + ')
		return cats
	}

	get currentFilters() {
		let text = this.categoryTitle

		if (text && this.locationTitle) text += ' + '
		if (this.locationTitle) text += this.locationTitle

		if (text && this.startDateFormat) text += ' + '
		if (this.startDateFormat) text += this.startDateFormat

		const datesNotTheSame = this.startDateFormat !== this.endDateFormat
		if (this.startDateFormat && this.endDateFormat && datesNotTheSame)
			text += ' - '
		if (this.endDateFormat && datesNotTheSame) text += this.endDateFormat
		else if (!this.endDateFormat && this.startDateFormat) text += ' onward'

		if (text && this.favoritesFeed) text += ' '
		if (this.favoritesFeed) text += '(Favorites Only)'

		if (!text.length) return 'No filters selected.'
		return text
	}

	get groupedEvents() {
		return _.groupBy(this.events, event => {
			return this.$moment(event.start_date).format('YYYY-MM-DD')
		})
	}

	get groupedEventDates() {
		return Object.keys(this.groupedEvents)
	}

	get groupedPosts() {
		return _.groupBy(this.posts, post => {
			return this.$moment(post.post_date).format('YYYY-MM-DD')
		})
	}

	get groupedPostDates() {
		return Object.keys(this.groupedPosts)
	}
}
</script>

<template>
	<panel class="panel-news-events feed">
		<template #panel-header>
			<div class="header-wrap">
				<form-button
					class="show-filters flat compact"
					@click="$emit('open-filters')"
				>
					<i class="fas fa-cogs"></i>
					<span>Preferences</span>
				</form-button>

				<navigation-pills v-model="selected" :tabs="tabs" />

				<form-button
					class="show-reservations flat compact"
					@click="$emit('open-reservations')"
				>
					<span>My Bookings</span>
					<i class="fas fa-book-open"></i>
				</form-button>
			</div>

			<div class="panel-subheading">
				<span>Currently viewing:</span><br />
				{{ currentFilters }}
			</div>
		</template>

		<scroll-notifier>
			<div v-if="selected === 'News'" ref="feed" class="feed">
				<template v-if="favoritesFeed && !favorite_events.length">
					<h4 class="no-items">No favorite items to display</h4>
				</template>

				<template v-else-if="posts.length">
					<template v-for="date in groupedPostDates">
						<div :key="date" class="item-group">
							<divider-title element="h4" class="group-date">
								{{ $moment(date).format('ddd, MMMM D, YYYY') }}
							</divider-title>

							<template v-for="post in groupedPosts[date]">
								<post-card :key="post.id" class="item" :post="post" />
							</template>
						</div>
					</template>
				</template>

				<template v-else>
					<h4 class="no-items">There are no items to display.</h4>
				</template>
			</div>
		</scroll-notifier>

		<scroll-notifier @end="nextPage">
			<div v-if="selected === 'Events'" ref="feed" class="feed">
				<template v-if="favoritesFeed && !favorite_events.length">
					<h4 class="no-items">No favorite items to display</h4>
				</template>

				<template v-else-if="events.length">
					<template v-for="date in groupedEventDates">
						<div :key="date" class="item-group">
							<divider-title element="h3" class="group-date">
								{{ $moment(date).format('ddd, MMMM D, YYYY') }}
							</divider-title>

							<template v-for="event in groupedEvents[date]">
								<event-card :key="event.id" class="item" :event="event" />
							</template>
						</div>
					</template>
				</template>

				<template v-else>
					<h4 class="no-items">There are no items to display.</h4>
				</template>
			</div>
		</scroll-notifier>

		<scroll-notifier>
			<div v-if="selected === 'Articles'" ref="feed" class="feed">
				<template v-if="articles.length">
					<template v-for="article in articles">
						<article-card :key="article.id" :article="article" />
					</template>
				</template>

				<template v-else>
					<h4 class="no-items">There are no items to display.</h4>
				</template>
			</div>
		</scroll-notifier>
	</panel>
</template>

<style lang="scss" scoped>
@import '@sassy';

.panel.feed::v-deep {
	@include flex(column);

	.panel-header {
		@include flex(column, center, center);
		width: 100%;
		padding-bottom: 13px;

		@media screen and (max-width: 876px) {
			padding: 10px;
		}
	}

	.panel-body {
		@include flex(column);
		flex: 1;
		padding: 28px;
		padding-top: 0px;
		padding-right: 12px;

		overflow-y: auto;

		@media screen and (max-width: 876px) {
			padding: 14px;
			padding-top: 0px;
			padding-bottom: 0px;
		}
	}
}

.panel.feed {
	width: 583px;
	height: 100%;

	.header-wrap {
		display: grid;
		grid-template-columns: auto auto auto;
		justify-content: space-between;
		width: 100%;

		position: relative;
		margin-bottom: 0.5em;

		& > .form-button {
			opacity: 0;
			pointer-events: none;
			border-radius: 5em;

			&::v-deep .button-inner {
				@include flex(row, space-between, center);
			}

			span {
				font-size: 0.8em;
			}

			i {
				height: 12px;
			}

			@include on-mobile(460px) {
				span {
					display: none;
				}

				i {
					margin: 0px;
				}
			}
		}

		@media screen and (max-width: 876px), (max-height: 900px) {
			.show-reservations,
			.show-filters {
				opacity: 1;
				pointer-events: all;
			}
		}
	}

	.panel-subheading {
		font-family: $lato-font;
		text-align: center;

		span {
			font-weight: 700;
		}
	}

	.feed {
		width: 100%;
		flex: 1;

		overflow-y: auto;
		border-radius: $border-radius;

		@media screen and (min-width: 876px) {
			padding-top: 13px;
			padding-right: 12px;
		}

		.item-group {
			padding-bottom: 0.5em;

			.group-date {
				@include flex(row, space-between, center);
				width: 100%;
				color: $that-gray;
				// font-weight: bold;
				margin-bottom: 0.5em;

				&:before,
				&:after {
					content: ' ';
					flex: 1;
					height: 1px;

					background-color: $that-gray;
				}

				span {
					padding: 0px 1em;
				}
			}

			.item {
				@include vertical-list-item;
			}
		}
	}

	.no-items {
		color: black;
		text-align: center;
	}
}
</style>
