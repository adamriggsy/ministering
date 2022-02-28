<tr class='companionship' data-companionshipid='{{$companionship->id}}'>
    {{-- @dump($companionship, $companionship->firstCompanion, $companionship->secondCompanion) --}}
    <td class='color'></td>
    
    <td class='comp_1'>{{ $companionship->firstCompanion->fullName }}</td>
    <td class='comp_2'>{{ $companionship->secondCompanion->fullName }}</td>
    <td>
        @if($user->canManage)
            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#companionshipManagementModal">Manage Companionship</button>
        @endif
    </td>
</tr>