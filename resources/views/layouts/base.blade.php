<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- CSRF Token -->
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', '') }} | @yield('page_title')</title>

        <!-- Fonts -->
        <link rel="dns-prefetch" href="//fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css?family=Inter" rel="stylesheet">

        <!-- Styles -->
        <link href="{{ mix('css/app.css') }}" rel="stylesheet">
        @yield('page_styles')
    </head>
    <body class='font-sans'>
        <div id="app">
            @yield('navigation')
            <main class="py-4">
                @yield('content')
            </main>
        </div>

        <!-- Scripts -->
        <script src="{{ mix('js/app.js') }}"></script>
        @yield('page_scripts')
    </body>
</html>