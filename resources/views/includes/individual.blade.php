<div class="individual">
	<p class="name">{{ $individual->name }}</p>
	<div class="ministerToFamilies">
		@foreach($individual->ministerTo() as $ministerTo)
			<p class="ministerTo">
				Minister To: {{ $ministerTo->last_name }}
			</p>
		@endforeach
	</div>
</div>
@dd($individual->ministerTo())