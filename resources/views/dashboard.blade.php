<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    @section('content')
        <div class="container-fluid">
            <h1 class="text-center">Welcome! {{ Auth::user()->name }}</h1>
            <div id="userLinks" class="mx-auto my-4 text-center d-grid gap-4 d-sm-block">
                @if(Auth::user()->canManage)
                    <a href="{{ route('all-households') }}" class="btn btn-outline-dark btn-light">View Households</a>
                @endif

                <a href="{{ route('ward-list') }}" class="btn btn-outline-dark btn-light">Manage Assignments</a>

                @if(Auth::user()->canApprove)
                    <a href="{{ route('approve-assignments') }}" class="btn btn-outline-dark btn-light">Approve Assignments</a>
                @endif
            </div>
        </div>
    @endsection
</x-app-layout>
