@extends('layouts.guest')
@section('content')
    <div class="px-5 py-5 p-lg-0 bg-surface-secondary">
        <div class="d-flex justify-content-center">
            <div class="col-12 border-left-lg min-h-lg-screen d-flex flex-column justify-content-center py-lg-16 px-lg-20 position-relative">
                <div class="row">
                    <div class="col-lg-10 col-md-9 col-xl-6 mx-auto ms-xl-0">
                        <div class="mt-10 mt-lg-5 mb-6 d-flex align-items-center d-lg-block">
                            <h1 class="ls-tight font-bolder h2">
                                {{ __('Create an account') }}
                            </h1>
                        </div>
                        <form method="POST" action="{{ route('register') }}">
                            @csrf
                            <div class="mb-5">
                                <label class="form-label" for="email">{{ __('Name') }}</label>
                                <input id="name" type="text" class="form-control @error('name') is-invalid @enderror" name="name" value="{{ old('name') }}" required autocomplete="name" autofocus>

                                @error('name')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                            <div class="mb-5">
                                <label class="form-label" for="email">{{ __('E-Mail Address') }}</label>
                                <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>

                                @error('email')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                            <div class="mb-5">
                                <label class="form-label" for="password">{{ __('Password') }}</label>
                                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">

                                @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                            <div class="mb-5">
                                <label class="form-label" for="password-confirm">{{ __('Confirm Password') }}</label>
                                <input id="password-confirm" type="password" class="form-control" name="password_confirmation" required autocomplete="new-password">
                            </div>
                            <div>
                                <button type="submit" class="btn btn-primary w-full">
                                    {{ __('Sign up') }}
                                </button>
                            </div>
                        </form>
                        <div class="my-6">
                            <small>{{ __('Already have an account?') }}</small>
                            <a href="{{ route('login') }}" class="text-warning text-sm font-semibold">{{ __('Sign in') }}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection