<x-modal-bs5 
    modalId="householdModal"
    modalTitle="Household Information"
>
    <x-slot name="secondBtn"></x-slot>

    <x-slot name="body">
        <div class="info d-flex justify-content-start">
            <div class="householdContainer">
                <h2 class="householdName"></h2>
                <div class="allComments"></div>
            </div>
        </div>
    </x-slot>
</x-modal-bs5>