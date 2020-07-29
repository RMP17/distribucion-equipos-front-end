export default {
    install (Vue, options) {
        Vue.mixin({
            // Add component lifecycle hooks or properties.
            methods:{
                $notifyErrors(errors){
                    if(errors.response.status===401){
                        this.$toastr('error', 'VUELVA A INCIAR SESION', 'ERRORES');
                        return;
                    }
                    let _errors = errors.response.data.errors;
                    let formatErrors = '';
                    Object.keys(errors.response.data.errors).forEach(value => {
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
