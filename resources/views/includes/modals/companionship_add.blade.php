<x-modal-bs5 
    modalId="companionshipAddModal"
    modalTitle="Add Companionship"
>
    <x-slot name="secondBtn">
        <button class="btn btn-success disabled" id="finalizeNewCompanionship">Finalize</button>
    </x-slot>

    <x-slot name="body">
        <div id="addCompanionshipSuccess" class="alert alert-success d-none">
            Companionship was created successfully.
        </div>
        <div id="addCompanionshipError" class="alert alert-danger d-none"></div>
        <div id='addCompanionshipInfo'>
            <h3>Companionship</h3>
            <p>Companion 1</p>
            <div id='addCompanionship1'></div>
            
            <p>Companion 2</p>
            <div id='addCompanionship2'></div>
        </div>
    </x-slot>
</x-modal-bs5>