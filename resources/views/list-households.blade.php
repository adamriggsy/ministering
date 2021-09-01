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
            <div id="householdSearch"></div>

            <div id="householdsContainer" data-maxcommentsshown="{{ $commentMax }}">
                <div 
                    class="household {{ $household->comments->count() > $commentMax ? 'showAllCommentsBtn' : ''}}"
                    data-householdid={{$household->id}}
                >
                    <i class="content-hide bi bi-dash-circle-dotted"></i>
                    <div class="firstSection">
                        <h2 class="nameContainer">
                            <span class="householdName">{{ $household->fullHouseholdName }}</span>
                            <i class="bi bi-chat-right-fill text-lg d-flex flex-column">
                                <span class="count">{{$household->comments->count()}}</span>
                            </i>
                        </h2>
                        <div class="text-center canHide">
                            <div class='commentBtns btn-group-sm {{ $household->comments->count() > $commentMax ? 'btn-group' : 'full-width'}}'>
                                <button class="commentBtn btn btn-primary" data-bs-target="#commentModal" data-bs-toggle="modal">
                                    Comment
                                </button>
                                <button class="showAllComments btn btn-outline-dark btn-light" data-bs-target="#householdModal" data-bs-toggle="modal">
                                    See All
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="allComments canHide">
                        @forelse($household->comments->sortByDesc('created_at')->slice(0, $commentMax) as $comment)
                            <div class='householdComment-card' data-commentid="{{ $comment->id }}">
                                <author>
                                    <span class="authorName">
                                        {{ $comment->author->name }}
                                    </span>
                                    <span class="commentDate">
                                        {{ $comment->updated_at->timezone(Session::get('user_timezone', 'America/Denver'))->format('Y-m-d h:i A')}}
                                    </span>
                                </author>
                                <p class="commentBody">{{ $comment->body }}</p>
                            </div>
                        @empty
                            <p class="text-center">No comments yet.</p>
                        @endforelse
                    </div>
                </div>

                {{-- <div id="householdsContainer" data-maxcommentsshown="{{ $commentMax }}">
                <div 
                    class="household {{ $household->comments->count() > $commentMax ? 'showAllCommentsBtn' : ''}}"
                    data-householdid={{$household->id}}
                >
                    <div class="firstSection">
                        <h2 class="nameContainer">
                            <span class="householdName">{{ $household->fullHouseholdName }}</span>
                            <i class="bi bi-chat-right-fill text-lg d-flex flex-column">
                                <span class="count">{{$household->comments->count()}}</span>
                            </i>
                        </h2>
                        <div class='commentBtns btn-group-sm {{ $household->comments->count() > $commentMax ? 'btn-group' : 'full-width'}}'>
                            <button class="commentBtn btn btn-primary" data-bs-target="#commentModal" data-bs-toggle="modal">
                                Comment
                            </button>
                            <button class="showAllComments btn btn-outline-dark btn-light" data-bs-target="#householdModal" data-bs-toggle="modal">
                                See All
                            </button>
                        </div>
                    </div>
                    <div class="allComments">
                        @forelse($household->comments->sortByDesc('created_at')->slice(0, $commentMax) as $comment)
                            <div class='householdComment-card' data-commentid="{{ $comment->id }}">
                                <author>
                                    <span class="authorName">
                                        {{ $comment->author->name }}
                                    </span>
                                    <span class="commentDate">
                                        {{ $comment->updated_at->timezone(Session::get('user_timezone', 'America/Denver'))->format('Y-m-d h:i A')}}
                                    </span>
                                </author>
                                <p class="commentBody">{{ $comment->body }}</p>
                            </div>
                        @empty
                            <p class="text-center">No comments yet.</p>
                        @endforelse
                    </div>
                </div> --}}
            </div>
        </div>
    </div>

    @include('includes.modals.comment', ['title' => 'Household Comment', 'showAssigned' => false])

    @include('includes.modals.household', ['title' => 'Household Comment', 'showAssigned' => false])
@endsection

@section('page_scripts')
    <script src="{{asset('js/autocomplete.js')}}"></script>
    <script src="{{asset('js/households.js')}}"></script>
    <script>
    	householdsHelper.functions.init({!! json_encode($household) !!}, {!! json_encode($householdSearch) !!});

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