@extends('layouts.app')
@section('page_title') Manage Companionships @endsection
@section('page_styles')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">

    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.0/css/dataTables.bootstrap5.min.css"/>

    <link href="{{ mix('css/manageAssignments.css') }}" rel="stylesheet">
@endsection

@section('content')
    
    <div class="container-fluid">
        <div class="row justify-content-center">
            <h1>
                Manage Companionships
                <button data-bs-target="#companionshipAddModal" data-bs-toggle="modal" id="addCompanionship" class="btn btn-success btn-circle-xl float-end" title="Add Companionship">+</button>
            </h1>
            
            <div id="companionshipsTable" class="relative d-flex items-top justify-center">
                <div class="table-responsive" >
                    <table id="allCompanionshipsTable" class="table table-sm table-striped" style="width:100%;"> 
                        <thead>
                            <tr>
                                <th></th>
                                <th data-priority="1">Companion 1</th>
                                <th data-priority="2">Companion 2</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($companionships as $companionship)
			                    @include('includes.companionship-only-list', ['companionship' => $companionship])
			                @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    
    @include('includes.modals.companionship_feedback')
    @include('includes.modals.companionship_management')
    @include('includes.modals.companionship_add')
@endsection

@section('page_scripts')
    <script type="text/javascript" src="https://cdn.datatables.net/v/dt/dt-1.10.25/r-2.2.9/datatables.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/1.11.0/js/dataTables.bootstrap5.min.js"></script>

    <script src="{{asset('js/autocomplete.js')}}"></script>
    <script src="{{asset('js/companionship.js')}}"></script>
    <script>
        $(function(){
            companionshipHelper.functions.init({!! $companionships->toJson() !!});
        });
    </script>
@endsection