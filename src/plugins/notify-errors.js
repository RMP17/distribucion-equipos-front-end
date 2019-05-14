export default {
    install (Vue, options) {
        Vue.mixin({
            // Add component lifecycle hooks or properties.
            methods:{
                $notifyErrors(errors){
                    let _errors = errors.response.data;
                    let formatErrors = '';
                    Object.keys(errors.response.data).forEach(value => {
                        formatErrors+='<li>' + _errors[value][0] + '</li>';
                    });
                    this.$toastr('error', formatErrors, 'ERRORES');
                },
                $notifyErrorsLocal(errors){
                    let formatErrors = '';
                    errors.forEach(value => {
                        formatErrors+='<li>' + value + '</li>';
                    });
                    this.$toastr('error', formatErrors, 'ERRORES');
                }
            }
        })
    }
}