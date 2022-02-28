<x-modal-bs5 
    modalId="companionshipManagementModal"
    modalTitle="Companionship Management"
>
    <x-slot name="secondBtn">
        <a href="#" id="deleteCompanionship" class="btn btn-danger" title="Delete Companionship">Delete</a>
    </x-slot>

    <x-slot name="body">
        <div id="activeCompanionship" class="relative items-top companionship" data-companionshipid="">
            <div id='companionshipInfo'>
                <h3>Companionship</h3>
                <p class='companionship1'></p>
                <p class='companionship2'></p>
            </div>
        </div>
    </x-slot>
</x-modal-bs5>