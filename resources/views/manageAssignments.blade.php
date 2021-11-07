@extends('layouts.app')
@section('page_title') Companionship Assignor @endsection
@section('page_styles')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">

    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.0/css/dataTables.bootstrap5.min.css"/>

    <link href="{{ mix('css/manageAssignments.css') }}" rel="stylesheet">
@endsection

@section('content')
    
    <div class="container-fluid">
        <div class="row justify-content-center">
            <h1>Manage Companionships</h1>
            {{-- @dd($companionships) --}}
            
            <div id="companionships" class="relative d-flex items-top justify-center">
                @foreach($companionships as $companionship)
                    @include('includes.companionship', ['companionship' => $companionship])
                @endforeach
            </div>
        </div>
    </div>
    {{-- <div id="unassignedTicker" class="ticker-wrap">
        <i id="tickerClose" class="ticker-close bi bi-x-circle text-lg"></i>
        <div class='ticker'>
            
        </div>
    </div> --}}
    @include('includes.modals.assignment_feedback')
    @include('includes.modals.assignment_management')
@endsection

@section('page_scripts')
    <script type="text/javascript" src="https://cdn.datatables.net/v/dt/dt-1.10.25/r-2.2.9/datatables.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/1.11.0/js/dataTables.bootstrap5.min.js"></script>

    <script src="{{asset('js/autocomplete.js')}}"></script>
    <script src="{{asset('js/assignment.js')}}"></script>
    <script>
        $(function(){
            assignmentHelper.functions.init({!! $companionships->toJson() !!});
        });
    </script>
@endsection