<tr class='household {{$household->status}}' data-householdid='{{$household->id}}'>
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
    <td><button class='assignHousehold btn btn-outline-dark btn-light'>Manage</button></td>
</tr>