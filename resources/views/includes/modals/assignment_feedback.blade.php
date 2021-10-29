<x-modal-bs5 
    modalId="assignmentFeedbackModal"
    modalTitle="Assignment Feedback"
>
    <x-slot name="secondBtn"></x-slot>

    <x-slot name="body">
        <div class="info">
            <div id="feedbackHousehold">
                <h2 class="householdName"></h2>
                <p>to be visited by</p>
                <h4><span class="assignedNames"></span></h4>
                <p>Assignment Status: <span id="assignStatus"></span></p>
            </div>
            <div id='aFeedbackContainer'></div>
        </div>
    </x-slot>
</x-modal-bs5>