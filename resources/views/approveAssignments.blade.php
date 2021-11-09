@extends('layouts.app')
@section('page_title') Approve Ministering Assignments @endsection
@section('page_styles')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">

    <link href="{{ mix('css/approval.css') }}" rel="stylesheet">
@endsection

@section('content')
    <div class="container-fluid">
        <div class="row justify-content-center" style="position:relative;">
            <div id="pageHeader">
                <div id="filterAssignmentsContainer" class="dropdown">
                    <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                        Filter Assignments
                    </a>

                    <ul id="filterChoice" class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <li class="dropdown-item" data-status="all">Show All</a></li>
                        <li class="dropdown-item" data-status="proposed">Show Proposed Only</a></li>
                        <li class="dropdown-item" data-status="rejected">Show Rejected Only</a></li>
                        <li class="dropdown-item" data-status="approved">Show Accepted Only</a></li>
                    </ul>
                </div>
                <h1>Assignments to be approved</h1>
                <div id="viewChoiceContainer" class="dropdown">
                    <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                        Change View Type
                    </a>

                    <ul id="viewChoice" class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <li class="dropdown-item" data-viewtype="list">List View</a></li>
                        <li class="dropdown-item" data-viewtype="grid">Grid View</a></li>
                    </ul>
                </div>
            </div>

            <div id='assignmentContainer' class='ajr-list'>
                @foreach ($assignments as $key => $assignment) 
                    <div 
                        class='household {{ $assignment->status }}' 
                        data-assignmentid='{{ $assignment->id }}'
                        data-householdid='{{ $assignment->household_id }}'
                        data-status='{{ $assignment->status }}'
                    >
                        <div class="infoContainer">
                            <div class="householdContainer">
                                <h2 class="householdName">{{ $assignment->household()->fullHouseholdName }}</h2>
                                <h4 class="status">{{ ucfirst($assignment->status) }}</h4>
                            </div>
                            
                            <div class="assignedApprovalContainer">
                                <h3>To be ministered by:</h3>
                                <div class="assignedContainer">
                                    <p>{{$assignment->companionship()->firstCompanion->name}} {{$assignment->companionship()->firstCompanion->last_name}}</p>
                                    <p>{{$assignment->companionship()->secondCompanion->name}} {{$assignment->companionship()->secondCompanion->last_name}}</p>
                                </div>
                                
                                <div class="statusError text-danger"></div>

                                <div class="approvalBtns btn-group btn-group-sm" role="group" aria-label="">
                                    <button type="button" class="btn btn-primary resetStatus">Reset Status</button>
                                    <button type="button" class="btn btn-success acceptAssignment">Accept</button>
                                    <button type="button" class="btn btn-danger rejectAssignment">Reject</button>
                                    <button type="button" class="btn btn-secondary feedback" data-bs-target="#commentModal" data-bs-toggle="modal">Feedback</button>
                                </div>
                            </div>
                        </div>
                        <div class='feedbackContainer'>
                            <h3>Feedback</h3>
                            <div class='allComments'>
                                @forelse($assignment->comments->sortByDesc('created_at') as $comment)
                                    <div class='ministeringComment' data-commentid="{{ $comment->id }}">
                                        <author>
                                            {{ $comment->author->name }} - {{ $comment->updated_at->timezone(Session::get('user_timezone', 'America/Denver'))->format('Y-m-d h:i A')}}
                                        </author>
                                        <p class="commentBody">{{ $comment->body }}</p>
                                    </div>
                                @empty
                                    <p>No feedback provided</p>
                                @endforelse
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>

    @include('includes.modals.comment', ['title' => 'Comment On Assignment', 'showAssigned' => true])

@endsection

@section('page_scripts')
    <script src="{{asset('js/approval.js')}}"></script>
    <script>
        $(document).on('show.bs.modal', '#commentModal', function(e) {
            let btn = $(e.relatedTarget);
            let parent = btn.closest('.household');
            let modal = $(this);
            let form = modal.find('form');

            modal.find('.householdName').text(parent.find('.householdName').text());
            modal.find('.assignedContainer').html(parent.find('.assignedContainer').html());
            
            $("#assignmentId").remove();
            $("<input>").attr({
                name: "assignmentId",
                id: "assignmentId",
                type: "hidden",
                value: parent.data('assignmentid')
            }).appendTo(form);
        });

        $(document).on('shown.bs.modal', '#commentModal', function(e) {
            $(this).find('#comment').focus();
        });

        approvalHelper.functions.init();
    </script>
@endsection