<x-modal-bs5 
    modalId="commentModal"
    modalTitle={{$title}}
>
    <x-slot name="secondBtn">
        <button id="submitComment" type="button" class="btn btn-primary">Save comment</button>
    </x-slot>

    <x-slot name="body">
        <div class="info d-flex justify-content-start">
            <div class="household me-10">
                <h4>Household:</h4>
                <div class="householdName"></div>
            </div>
            @if($showAssigned)
                <div class="assigned">
                    <h4>Assigned:</h4>
                    <div class="assignedContainer"></div>
                </div>
            @endif
        </div>
        @include("includes.forms.comment", ['showSubmit' => false])
    </x-slot>
</x-modal-bs5>