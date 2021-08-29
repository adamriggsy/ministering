@extends('layouts.app')
@section('page_title') Approve Ministering Assignments @endsection
@section('page_styles')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">

    <link href="{{ asset('css/approval.css') }}" rel="stylesheet">
@endsection

@section('content')
    <div class="container-fluid">
        <div class="row justify-content-center">
            <h1>Assignments to be approved</h1>
            @foreach ($assignments as $key => $ag) 
            {{-- @dump($ag['assignment']) --}}
                <div class='household' data-ministerid='{{ $ag['assignment']->id }}'>
                    <h2 class="householdName">{{ $ag['assignment']->household->fullHouseholdName }}</h2>
                    <div class="assignedContainer">
                        @foreach($ag['individuals'] as $individual)
                            @if(!is_null($individual))
                                <p>{{$individual->name}} {{$individual->last_name}}</p>
                            @endif
                        @endforeach
                    </div>
                    <div class="approvalBtns btn-group btn-group-sm" role="group" aria-label="">
                        <button id="acceptAssignment" type="button" class="btn btn-success">Accept</button>
                        <button id="rejectAssignment" type="button" class="btn btn-danger">Reject</button>
                        <button id="feedback" type="button" class="btn btn-secondary" data-bs-target="#commentModal" data-bs-toggle="modal">Feedback</button>
                    </div>
                    <div class='allComments'>
                        @foreach($ag['assignment']->comments->sortByDesc('created_at') as $comment)
                            <div class='ministeringComment' data-commentid="{{ $comment->id }}">
                                <author>
                                    {{ $comment->author->name }} - {{ $comment->updated_at->format('Y-m-d h:i A')}}
                                </author>
                                <p class="commentBody">{{ $comment->body }}</p>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endforeach
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
                    <h4>Household:</h4>
                    <div class="householdName"></div>
                    <h4>Assigned:</h4>
                    <div class="assignedContainer"></div>
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
            // modal.find('#submitComment').data('householdid', parent.data('houseid'));
            
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