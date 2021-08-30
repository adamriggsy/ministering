@extends('layouts.app')
@section('page_title') List Households @endsection
@section('page_styles')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">

    {{-- <link href="{{ mix('css/approval.css') }}" rel="stylesheet"> --}}
@endsection

@section('content')
    <div class="container-fluid">
        <div class="row justify-content-center" style="position:relative;">
            <h1>Households</h1>
            @dump($households)
        </div>
    </div>
@endsection

@section('page_scripts')
    {{-- <script src="{{asset('js/approval.js')}}"></script> --}}
    
@endsection