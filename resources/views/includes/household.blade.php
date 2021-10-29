<tr class='household {{$household->status}}' data-householdid='{{$household->id}}'>
    <td class='color'></td>
    <td class='hh_lastName'>{{ $household->last_name }}</td>
    <td class='hh_husbandName'>{{ $household->husband()->name ?? '' }}</td>
    <td class='hh_wifeName'>{{ $household->wife()->name ?? '' }}</td>
    <td class='hh_ministeringSis'>{{ $household->ministeringSister }}</td>
    <td class='hh_ministeringBro'>{{ $household->ministeringBrother }}</td>
    <td class='hh_ministeringTo'>
    	@foreach($household->head()->ministerTo as $ministerTo)
			<p class="ministerTo" data-householdid="{{ $ministerTo->id }}">{{ $ministerTo->householdName }}</p>
		@endforeach
    </td>
    
    <td>
        @if($user->canManage)
            <button class='assignHousehold btn btn-outline-dark btn-light'>Manage</button>
        @else
            &nbsp;
        @endif
    </td>
    <td class="assignedStatus">
        <div class="d-flex">
            @if(!empty($household->ministeringSister))
                @if($household->ministeredByStatus === 'approved')
                    <i class="bi bi-check-circle-fill text-success"></i>
                @elseif($household->ministeredByStatus === 'rejected')
                    <i class="bi bi-x-circle-fill text-danger"></i>
                @else
                    <i class="bi bi-dash-circle-fill text-black-50"></i>
                @endif

                @if($user->canManage)
                    @if(
                        !is_null($household->ministeredByAssignment()->first()) &&
                        $aCount = $household->ministeredByAssignment->first()->comments->count() > 0
                    )
                        <button class='assignmentComments' data-bs-toggle="modal" data-bs-target="#assignmentFeedbackModal">
                            <i class="bi bi-chat-right-fill text-lg d-flex flex-column">
                                <span class="count">{{$aCount}}</span>
                            </i>
                        </button>
                    @endif
                @endif
            @endif
        </div>
    </td>
</tr>