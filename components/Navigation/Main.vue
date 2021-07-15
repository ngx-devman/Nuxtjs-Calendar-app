<script lang="ts">
import { Vue, Component, Getter, Watch } from 'nuxt-property-decorator'

@Component
export default class NavigationMain extends Vue {
	@Getter('auth/user') user!: any

	menuState: boolean = false

	@Watch('$route')
	routeChanged() {
		this.menuState = false
	}
}
</script>

<template>
	<nav class="navigation-main" :class="{ 'mobile-menu-open': menuState }">
		<section class="site-welcome">
			<img src="/assets/images/logo.svg" alt="" class="site-logo" />

			<div v-if="user" class="welcome-inner">
				<h3 class="greeting">
					Welcome,
					<span class="user-name">{{ user.first_name }}</span>
				</h3>

				<template v-if="user.location">
					<span>Home Club: {{ user.location.title }}</span>
				</template>
			</div>
		</section>

		<menu-button :state.sync="menuState" />

		<section class="menu-account">
			<div class="site-menu">
				<nuxt-link to="/">Calendar</nuxt-link>
				<nuxt-link to="/somewhere">Back to Member Portal</nuxt-link>
			</div>
		</section>
	</nav>
</template>

<style lang="scss" scoped>
@import '@sassy';

.navigation-main {
	@include flex(row, space-between, center);
	padding: 56px;
	padding-bottom: 0px;

	.site-welcome {
		@include flex(row, flex-start, center);
		font-family: $sorts-font;

		.site-logo {
			width: 50px;
			height: 50px;
			margin-right: 11px;
		}

		.welcome-inner {
			@include flex(column);

			.greeting {
				font-size: 24px;
				padding: 0px;

				span {
					font-family: inherit;
				}
			}

			& > span {
				margin-left: 0.5em;
			}

			@media screen and (min-width: 335px) {
				.greeting {
					line-height: 37px;
				}
			}

			@media screen and (max-width: 335px) {
				.greeting {
					font-size: 20px;
				}
			}
		}
	}

	.menu-button {
		display: none;
	}

	.menu-account {
		@include flex(row, flex-end, center);

		.site-menu {
			@include flex(row, flex-end, center);

			a {
				// font-size: 14px;
				text-decoration: none;
				font-family: 'Lato', sans-serif;

				@include horizontal-list-item(18px);

				&.nuxt-link-active {
					font-weight: 900;
				}
			}
		}
	}

	@include tablet {
		padding-top: 28px;
		// padding-bottom: 28px;
		z-index: 25;

		& > * {
			z-index: 1;
		}

		.site-welcome {
			z-index: 26;
		}

		.menu-button {
			display: unset;
			z-index: 26;
		}

		.menu-account {
			@include flex(column, center, center);
			width: 100%;
			height: 100%;

			position: fixed;
			left: 0px;
			top: 0px;

			opacity: 0;
			pointer-events: none;
			transition: opacity 0.25s;

			@include glass-it($blur: 15px);

			.site-menu {
				display: grid;
				grid-auto-flow: row;
				row-gap: 0.5em;

				a {
					margin: 0px;
				}
			}
		}

		&.mobile-menu-open {
			.menu-account {
				z-index: 25;
				opacity: 1;
				pointer-events: all;
			}
		}
	}

	@media screen and (max-width: 876px), (max-height: 850px) {
		padding: 10px;
	}
}
</style>
