@extends('layouts.app')
@section('page_title') Approve Ministering Assignments @endsection
@section('page_styles')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">

    <link href="{{ asset('css/approval.css') }}" rel="stylesheet">
@endsection

@section('content')
    <div class="container-fluid">
        <div class="row justify-content-center" style="position:relative;">
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
            <div id='assignmentContainer' class='ajr-list'>
                @foreach ($assignments as $key => $ag) 
                    <div 
                        class='household {{ $ag['assignment']->status }}' 
                        data-ministerid='{{ $ag['assignment']->id }}'
                        data-householdid='{{ $ag['assignment']->household_id }}'
                    >
                        <div class="infoContainer">
                            <div class="householdContainer">
                                <h2 class="householdName">{{ $ag['assignment']->household->fullHouseholdName }}</h2>
                                <h4 class="status">{{ ucfirst($ag['assignment']->status) }}</h4>
                            </div>
                            
                            <div class="assignedApprovalContainer">
                                <div class="assignedContainer">
                                    @foreach($ag['individuals'] as $individual)
                                        @if(!is_null($individual))
                                            <p>{{$individual->name}} {{$individual->last_name}}</p>
                                        @endif
                                    @endforeach
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
                        <div class='allComments'>
                            <h3>Feedback</h3>
                            @forelse($ag['assignment']->comments->sortByDesc('created_at') as $comment)
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
                @endforeach
            </div>
        </div>
    </div>

    <div id="commentModal" class="modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Comment on Assignment</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="info d-flex justify-content-start">
                        <div class="household me-10">
                            <h4>Household:</h4>
                            <div class="householdName"></div>
                        </div>
                        <div class="assigned">
                            <h4>Assigned:</h4>
                            <div class="assignedContainer"></div>
                        </div>
                    </div>
                    @include("includes.forms.comment", ['showSubmit' => false])
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button id="submitComment" type="button" class="btn btn-primary">Save comment</button>
                </div>
            </div>
        </div>
    </div>
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
            
            $("#householdId").remove();
            $("<input>").attr({
                name: "ministerId",
                id: "ministerId",
                type: "hidden",
                value: parent.data('ministerid')
            }).appendTo(form);
        });

        approvalHelper.functions.init();

        const commentTemplate = function commentTemplate(id, body, author ) {
            return `
                <div class='ministeringComment' data-commentid="${id}">
                    <author>${author}</author>
                    <p class="commentBody">${body}</p>
                </div>
            `;
        };

        approvalHelper.functions.setDataAttr('commentTemplate', commentTemplate);
    </script>
@endsection