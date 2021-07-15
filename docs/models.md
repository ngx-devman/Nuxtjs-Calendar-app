# Models
***Location:*** *includes/models*

Models are the primary way of interacting with data objects recieved from apis such as the one we use for events & reservations. These models are exported TypeScript modules containing:

- `Data` interface that provides information & types for the data object
- `Default` object that contains default values for the properties in the object
- `create` function that takes a data parameter and merges the `Default` object with it
- `ProvideIt` constant that is the key used in PropSync, Provide, and Inject
- `InjectIt` constant that provides defaults for injecting this data object
- `Mixin` component class that provides many basic properties or methods
- `Source` component class that provides the data object via Vue
- `Propped` component class that binds the data property to a prop sync
- `Injected` component class that binds the data property to a reactive inject

Models can also provide a `ProppedSource` or `InjectedSource`. These are used in instances where the data object is provided, but transforms it when providing it to this child components. A example would be the reservation form modal (`components/Reservations/FormModal.vue`). The only way for a modal to recieve the reservation/event is via a prop. However, this is considered a source component because it is the start of the data flow.

## Mixin
The `Mixin` class is meant to be the main class that contains all properties and methods that could be used to access or modify a data object. These classes usually only add one actual property to the component. This is the data property, what we use to store or map the data. To prevent naming issues, the data objects prepend the term `the_` to the name. Getters and setters are then setup that exclude `the_` from the name.

#### Example
```TypeScript
@Component
export class Mixin extends Vue {
	the_data_object!: Data

	get data_object() {
		return this.the_data_object
	}

	set data_object(v) {
		this.the_data_object = v
	}
}
```

This allows other models to extend this class and remap there the data source is like so.

```TypeScript
//@file includes/models/ClubLocation.ts
export module ClubLocation {
	@Component
	export class Mixin extends Vue {
		the_club_location!: Data

		get club_location() {
			return this.the_club_location
		}

		set club_location(v) {
			this.the_club_location = v
		}
	}
}

//@file includes/models/ClubEvent.ts
export module ClubEvent {
	@Component
	export class Mixin extends ClubLocation.Mixin {
		the_club_event!: Data

		get club_event() {
			return this.the_club_event
		}

		set club_event(v) {
			this.the_club_event = v
		}

		get club_location() {
			return this.club_event.locations
		}

		set club_location(v) {
			this.club_event.locations = v
		}
	}
}

//@file components/ClubLocation.vue
import CLocation from '@includes/models/ClubLocation'

@Component
export default class ClubLocation extends CLocation.Mixin {
	mounted() {
		// points to this.the_club_location
		console.log(this.club_location)
	}
}

//@file components/Events/Card.vue
@Component
export default class EventCard extends ClubEvent.Mixin {
	mounted() {
		// now points to this.club_event.locations
		console.log(this.club_location)
	}
}
```

It also allows us to change where data object is coming from too.

```TypeScript
//@file includes/models/ClubEvent
export module ClubEvent {
	export const ProvideIt = 'event

	@Component
	export class Mixin extends Vue {
		the_club_event!: Data

		get club_event() {
			return this.the_club_event
		}

		set club_event(v) {
			this.the_club_event = v
		}
	}

	@Component
	export class Propped extends Mixin {
		@PropSync(ProvideIt, {type: Object})
		the_club_event!: Data
	}
}
```

and then in vue

```Vue
<script type="ts">
//@file components/Event/Card.vue
@Component
export default class EventCard extends ClubEvent.Propped {
	mounted() {
		// returns this.the_club_event which is now prop synced to `event`
		console.log(this.club_event)
	}
}
</script>

<template>
	<div class="event-card">{{club_event.title}}</div>
</template>
```

```Vue
<script type="ts">
//@file components/Feed.vue
@Component
export default class Feed extends Vue {
	club_events = []
}
</script>

<template>
	<div class="feed">
		<event-card v-for="(event, i) in club_events" :key="event.id" :event.sync="club_events[i]" />
	</div>
</template>
```

#### Note About Source, Propped, and Injected Model Classes
While models with the `Propped` or `ProppedSource` classes use the `PropSync` decorator, attaching `.sync` on the component is completely optional and will only prevent it from being updated.

On the other hand `Source` (plus `ProppedSource` and `InjectedSource`) and `Injected` classes use the reactive versions to provide and inject. This is because overriding either (`@Inject` and `@InjectReactive` or `@Provide` and `@ProvideReactive`) causes issues with Vue and lead to debugging data flow which is unwanted. If it is required to disable the reactivity then these classes should be be used to extend a component but instead use the base `Mixin` class.

## Source Classes
The `Source` model class is used to determine the source of the 'source' of the data for it's child components. This class can have two variants: `ProppedSource` and `InjectedSource`. 

### Source
This class is used for when the data object is defined by the current component. An example of this would be for a page component:
```Vue
<script type="ts">
//@file pages/events/_id/index.vue
@Component
export default class PageEventSingle extends ClubEvent.Source {
	asyncData({store, params}) {
		return store
			.dispatch('events/fetch_single', params.id)
			.then((the_club_event) => ({the_club_event}))
	}

	mounted() {
		// data is fetched via asyncData which defines the_club_event once finished
		console.log(this.club_event)
	}
}
</script>
```

### ProppedSource & InjectedSource
These classes are used for when the data object is provided via a prop or injected but the current component either:
- needs to modify the data object for it's children
- is technically considered the source for it's children

An example of this class being used is with the `EventCard` and `Feed` components. The current system is only setup to handle 1 data object, but the `Feed` component will have many. Meaning providing the `ClubEvent` object here would not work because it needs to worry about all of them. So in this case, the `Feed` component should not extend a `ClubEvent` mixin.
```Vue
<script type="ts">
//@file components/Event/Title.vue
@Component
export default class EventTitle extends ClubEvent.Injected {
	// since we are extending ClubEvent.Injected, there is no need to write anything else.
	// Injected will tell Vue the data is coming from a inject
}
</script>

<template>
	<h1 class="event-title">
		{{ club_event.title }}
	</h1>
</template>
```

```Vue
<script type="ts">
//@file components/Event/Card.vue
@Component
export default class EventCard extends ClubEvent.ProppedSource {
	// since we are extending ClubEvent.ProppedSource, there is no need to write anything else.
	// Propped will tell Vue the data is coming from a prop
	// Source will tell Vue that this needs to be the source of truth for it's child components
}
</script>

<template>
	<card class="event">
		<event-title />
	</card>
</template>
```

```Vue
<script type="ts">
//@file components/Feed.vue
@Component
export default class Feed extends Vue {
	club_events = []
}
</script>

<template>
	<div class="feed">
		<event-card v-for="(event, i) in club_events" :key="event.id" :event.sync="club_events[i]" />
	</div>
</template>
```

### Note when using ProppedSource
Components extending the `ProppedSource` class should have their prop synced (i.e. `:event.sync="event"`). Otherwise the component will not be able to update the data itself and won't be considered a source. While a error will not be produced, it will create logic and data flow issues. 

```Vue
<template>
	<!-- Bad -->
	<event-card :event="event"/>
	<!-- Good -->
	<event-card :event.sync="event" />
</template>
```
