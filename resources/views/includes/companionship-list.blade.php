<tr class='companionship' data-companionshipid='{{$companionship->id}}'>
    {{-- @dump($companionship, $companionship->firstCompanion, $companionship->secondCompanion) --}}
    <td class='color'></td>
    
    <td class='comp_1'>{{ $companionship->firstCompanion->fullName }}</td>
    <td class='comp_2'>{{ $companionship->secondCompanion->fullName }}</td>
    <td class='assignments'>
        @foreach($companionship->assignments as $assignment)
            <div 
                class="household"
                data-householdid="{{ $assignment->household()->id }}"
            >
                @if($assignment->household()->ministeredByStatus === 'approved')
                    <i class="status-circle bi bi-check-circle-fill text-success"></i>
                @elseif($assignment->household()->ministeredByStatus === 'rejected')
                    <i class="status-circle bi bi-x-circle-fill text-danger"></i>
                @else
                    <i class="status-circle bi bi-dash-circle-fill text-black-50"></i>
                @endif
                <p>
                    {{ $assignment->household()->fullHouseholdName }}
                    <i class="removeAssigned bi-x-circle small text-danger"></i>
                </p>
            </div>
        @endforeach
    </td>
    <td>
        <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#assignmentManagementModal">Manage Assignments</button>
    </td>
    {{--
    <td class="assignedStatus" data-order="{{ $household->ministeredByStatus == "N/A" ? '1' : $household->ministeredByStatus}}">
        <div class="d-flex">
            @if(!is_null($household->ministeredBy))
                @if($household->ministeredByStatus === 'approved')
                    <i class="bi bi-check-circle-fill text-success"></i>
                @elseif($household->ministeredByStatus === 'rejected')
                    <i class="bi bi-x-circle-fill text-danger"></i>
                @else
                    <i class="bi bi-dash-circle-fill text-black-50"></i>
                @endif

                @if($user->canManage)
                    @if(
                        !is_null($household->ministeredBy) &&
                        $household->ministeredBy->comments->count() > 0
                    )
                        <button class='assignmentComments' data-bs-toggle="modal" data-bs-target="#assignmentFeedbackModal">
                            <i class="bi bi-chat-right-fill text-lg d-flex flex-column">
                                <span class="count">{{ $household->ministeredBy->comments->count() }}</span>
                            </i>
                        </button>
                    @endif
                @endif
            @endif
        </div>
    </td>
    --}}
</tr>