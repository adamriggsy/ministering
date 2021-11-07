<div 
	class="companionship"
	data-companionshipid="{{ $companionship->id }}"
>
	<div class="individuals">
		<h4>Companionship</h4>
		<p class="individual">{{ $companionship->firstCompanion->fullName }}</p>
		<p class="individual">{{ $companionship->secondCompanion->fullName }}</p>
	</div>

	<h4>Assigned to Visit</h4>
	<div class="assignments">
		@forelse($companionship->assignments as $assignment)
			<div 
				class="household"
				data-householdid="{{ $assignment->household()->id }}"
			>
				<p>
					{{ $assignment->household()->fullHouseholdName }}
					<i class="removeAssigned bi-x-circle small text-danger"></i>
				</p>
			</div>
		@empty
			<p class="household">No Assignment</p>
		@endforelse
	</div>

	<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#assignmentManagementModal">Manage Assignments</button>
</div>