<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    @section('content')
        <div class="py-12">
            <div id="userLinks" class="max-w-7xl mx-auto my-4 sm:px-6 lg:px-8 flex text-center">
                <a href="{{ route('ward-list') }}" class="btn btn-outline-dark btn-light">Manage Assignments</a>

                @if(Auth::user()->canApprove)
                    <a href="{{ route('approve-assignments') }}" class="btn btn-outline-dark btn-light">Approve Assignments</a>
                @endif
            </div>
        </div>
    @endsection
</x-app-layout>
