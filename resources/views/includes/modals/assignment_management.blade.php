<x-modal-bs5 
    modalId="assignmentManagementModal"
    modalTitle="Assignment Management"
>
    <x-slot name="secondBtn"></x-slot>

    <x-slot name="body">
        <div id="activeCompanionship" class="relative items-top companionship" data-companionshipid="">
            <div id='companionshipInfo'>
                <h3>Companionship</h3>
                <p class='companionship1'></p>
                <p class='companionship2'></p>
            </div>
            <div id='ministeringInfo'>
                <h3>Assigned to Visit</h3>
                <div id='assignedToVisitContainer'></div>
                <div id="assignHouseholdContainer"></div>
            </div>
            {{-- <div id="companionshipComments">
                <h3>Comments</h3>
                <ul class="nav nav-tabs flex-column flex-sm-row" id="commentsNav" role="tablist">
                    <li id="commentNavView" class="nav-item flex-sm-fill" role="presentation">
                        <button class="nav-link active" id="view-tab" data-bs-toggle="tab" data-bs-target="#view" type="button" role="tab" aria-controls="view" aria-selected="true">View</button>
                    </li>
                    <li id="commentNavCreate" class="nav-item flex-sm-fill" role="presentation">
                        <button class="nav-link" id="create-tab" data-bs-toggle="tab" data-bs-target="#create" type="button" role="tab" aria-controls="create" aria-selected="false">Create</button>
                    </li>
                </ul>
                <div class="tab-content" id="commentContent">
                    <div class="tab-pane fade show active" id="view" role="tabpanel" aria-labelledby="view-tab">
                        @include('includes.utilities.ajax-loader', ['classes' => 'small dark'])
                        <div id="commentsContainer"></div>
                    </div>
                    <div class="tab-pane fade" id="create" role="tabpanel" aria-labelledby="create-tab">
                        @include('includes.forms.comment', ['showSubmit' => true])
                    </div>
                </div>
            </div> --}}
        </div>
    </x-slot>
</x-modal-bs5>