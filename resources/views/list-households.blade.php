@extends('layouts.app')
@section('page_title') List Households @endsection
@section('page_styles')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">

    <link href="{{ mix('css/households.css') }}" rel="stylesheet">
@endsection

@section('content')
    <div class="container-fluid">
        <div class="row justify-content-center" style="position:relative;">
            <h1>Households</h1>
            <div id="householdsContainer" data-maxcommentsshown="{{ $commentMax }}">
            	@foreach($households as $household)
            		<div 
                        class='household {{ $household->comments->count() > $commentMax ? 'showAllCommentsBtn' : ''}}' 
                        data-householdid='{{ $household->id }}'
                    >
            			<h2 class="nameContainer">
            				<span class="householdName">
            					{{ $household->fullHouseholdName }}
            				</span>
            				<i class="bi bi-chat-right-fill text-lg d-flex flex-column">
            					<span class="count">{{$household->comments->count()}}</span>
            				</i>
        				</h2>
            			<div class="allComments">
            				@forelse($household->comments->sortByDesc('created_at')->slice(0, $commentMax) as $comment)
                                <div class='householdComment' data-commentid="{{ $comment->id }}">
                                    <author>
                                        {{ $comment->author->name }} - {{ $comment->updated_at->timezone(Session::get('user_timezone', 'America/Denver'))->format('Y-m-d h:i A')}}
                                    </author>
                                    <p class="commentBody">{{ $comment->body }}</p>
                                </div>
                            @empty
                                <p class="text-center">No comments yet.</p>
                            @endforelse
            			</div>
            			<div class='commentBtns btn-group-sm {{ $household->comments->count() > $commentMax ? 'btn-group' : 'full-width'}}'>
            				<button class="commentBtn btn btn-primary" data-bs-target="#commentModal" data-bs-toggle="modal">
            					Comment
            				</button>
        					<button class="showAllComments btn btn-outline-dark btn-light" data-bs-target="#householdModal" data-bs-toggle="modal">
            					See All
            				</button>
            			</div>
            		</div>
            	@endforeach
            </div>
        </div>
    </div>

    @include('includes.modals.comment', ['title' => 'Household Comment', 'showAssigned' => false])

    @include('includes.modals.household', ['title' => 'Household Comment', 'showAssigned' => false])
@endsection

@section('page_scripts')
    <script src="{{asset('js/households.js')}}"></script>
    <script>
    	householdsHelper.functions.init({!! $households->toJson() !!});

    	$(document).on('show.bs.modal', '#commentModal', function(e) {
            let btn = $(e.relatedTarget);
            let parent = btn.closest('.household');
            let modal = $(this);
            let form = modal.find('form');

            modal.find('.householdName').text(parent.find('.householdName').text());
            modal.find('.assignedContainer').html(parent.find('.assignedContainer').html());
            
            $("#householdId").remove();
            $("<input>").attr({
                name: "householdId",
                id: "householdId",
                type: "hidden",
                value: parent.data('householdid')
            }).appendTo(form);
        });

        $(document).on('shown.bs.modal', '#commentModal', function(e) {
        	$(this).find('#comment').focus();
        });

        $(document).on('show.bs.modal', '#householdModal', function(e) {
        	householdsHelper.functions.populateHouseholdModal($(e.relatedTarget));
        });
    </script>
    
@endsection