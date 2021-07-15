<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class Notification extends Vue {
	@Prop({ required: true }) item!: any
}
</script>

<template>
	<div class="notification" :class="item.type">
		<div class="body">
			<template v-if="typeof item === 'string'">
				{{ item }}
			</template>
			<template v-else-if="typeof item === 'object'">
				<h3 v-if="item.title" class="title">{{ item.title }}</h3>

				<div v-if="item.content" class="content">
					{{ item.content }}
				</div>
			</template>
		</div>

		<div class="side-bar">
			<i class="fal fa-times" @click="$notify.remove(item)" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

@keyframes flyup {
	from {
		position: relative;
		left: 100%;
		opacity: 0;
	}
	to {
		position: relative;
		left: 0px;
		opacity: 1;
	}
}

.notification {
	@include flex(row, flex-start, stretch);
	min-width: 200px;
	max-width: 300px;
	padding: 0.5em 1em;

	color: $that-gray;

	@include glass-it(
		linear-gradient(
			90deg,
			rgba(255, 255, 255, 0.8) 0%,
			rgba(211, 247, 255, 1) 100%
		),
		2px
	);

	animation: flyup 0.5s;
	animation-fill-mode: forwards;

	border-radius: $border-radius;

	.body {
		flex: 1;

		.title {
			margin-right: 0.5em;
			font-weight: bold;
		}
	}

	.side-bar {
		margin-left: 1em;
	}

	&.alert {
		// @include glass-it(rgba($color-alert, 0.8), 4px);
		.title {
			color: $color-alert;
		}
	}

	&.success {
		// @include glass-it(rgba($color-success, 0.8), 4px);
		.title {
			color: $color-success;
			filter: saturate(75%);
		}
	}
}
</style>
