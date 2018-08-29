(function () {

    angular.module("app.web").controller("HomeController", HomeController);

    function HomeController($mdSidenav, $mdMedia, $state) {

        var self = this;

        self.toggle = toggleSidenav;
        self.gtSm = $mdMedia('gt-sm');
        self.sm = $mdMedia('sm');
        self.menu   = [];
        self.go     = go;
        self.$state = $state;

        function toggleSidenav() {
            $mdSidenav('left').toggle();
        }

        function go(state) {
            $state.go(state);
        }

        angular.forEach($state.get(), function (state) {
            if (state.menu) {
                self.menu.push(state);
            }
        });

    }

})();