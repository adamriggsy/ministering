@extends('layouts.app')
@section('page_title') Ministering Assignor @endsection
@section('page_styles')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">

    {{-- <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.25/r-2.2.9/datatables.min.css"/> --}}
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.0/css/dataTables.bootstrap5.min.css"/>

    <link href="{{ mix('css/ministering.css') }}" rel="stylesheet">
@endsection

@section('content')
    <div class="container-fluid">
        <div class="row justify-content-center">
            <div id="activeHousehold" class="relative items-top d-none">
                <i id="activeClose" class="bi-x-circle small"></i>
                <div id='householdInfo'>
                    <h2 class='householdName'></h2>
                    <p class='husbandName'></p>
                    <p class='wifeName'></p>
                </div>
                <div id='ministeringInfo'>
                    <h3>Assigned to Visit</h3>
                    <div id='assignedToVisitContainer'></div>
                    <div id="assignHouseholdContainer"></div>
                    
                    <hr>
                    
                    <h3>Assigned Ministers <i class="removeVisiting bi-x-circle fs-6 text-danger"></i></h3>
                    <div id='visitingHousehold'>

                    </div>
                </div>
                <div id="householdComments">
                    <h3>Comments</h3>
                    <ul class="nav nav-tabs flex-column flex-sm-row" id="commentsNav" role="tablist">
                        <li id="commentNavView" class="nav-item flex-sm-fill" role="presentation">
                            <button class="nav-link active" id="view-tab" data-bs-toggle="tab" data-bs-target="#view" type="button" role="tab" aria-controls="view" aria-selected="true">View</button>
                        </li>
                        <li id="commentNavCreate" class="nav-item flex-sm-fill" role="presentation">
                            <button class="nav-link" id="create-tab" data-bs-toggle="tab" data-bs-target="#create" type="button" role="tab" aria-controls="create" aria-selected="false">Create</button>
                        </li>
                    </ul>
                    <div class="tab-content" id="commentContent">
                        <div class="tab-pane fade show active" id="view" role="tabpanel" aria-labelledby="view-tab">
                            @include('includes.utilities.ajax-loader', ['classes' => 'small dark'])
                            <div id="commentsContainer"></div>
                        </div>
                        <div class="tab-pane fade" id="create" role="tabpanel" aria-labelledby="create-tab">
                            @include('includes.forms.comment', ['showSubmit' => true])
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="households" class="relative d-flex items-top justify-center">
                <div class="table-responsive" >
                    <table id="allHouseholdsTable" class="table table-sm table-striped" style="width:100%;"> 
                        <thead>
                            <tr>
                                <th></th>
                                <th data-priority="1">Family</th>
                                <th data-priority="2">Brother</th>
                                <th>Sister</th>
                                <th>Companion 1</th>
                                <th>Companion 2</th>
                                {{-- <th>Ministering To</th> --}}
                                {{-- <th data-priority="3"></th> --}}
                                <th data-priority="4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($households as $household)
                                @include('includes.household', ['household' => $household])
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    {{-- <div id="unassignedTicker" class="ticker-wrap">
        <i id="tickerClose" class="ticker-close bi bi-x-circle text-lg"></i>
        <div class='ticker'>
            
        </div>
    </div> --}}
    @include('includes.modals.assignment_feedback')
@endsection

@section('page_scripts')
    <script type="text/javascript" src="https://cdn.datatables.net/v/dt/dt-1.10.25/r-2.2.9/datatables.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/1.11.0/js/dataTables.bootstrap5.min.js"></script>

    <script src="{{asset('js/autocomplete.js')}}"></script>
    <script src="{{asset('js/ministering.js')}}"></script>
    <script>
        $(function(){
            ministeringHelper.functions.init({!! $households->toJson() !!});
            ministeringHelper.functions.resetDataTable();
        });
    </script>
@endsection