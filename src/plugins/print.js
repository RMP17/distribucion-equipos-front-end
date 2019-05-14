export default {
    install (Vue, options) {
        Vue.mixin({
            // Add component lifecycle hooks or properties.
            methods:{
                $printCustom(element){
                    let domClone = element.cloneNode(true);
                    let printSection = document.getElementById("printSection");
                    if (!printSection) {
                        let printSection = document.createElement("div");
                        printSection.class = "printSection";
                        document.body.appendChild(printSection);
                    }
                    // printSection.innerHTML = "";
                    printSection.appendChild(domClone);
                    this.$nextTick(()=>{
                        window.print();
                        printSection.innerHTML = "";
                    });
                }
            }
        })
    }
}