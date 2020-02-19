(()=>{
    'use strict';

    App.register("date", class extends Stimulus.Controller {
        connect(){
            let val = this.data.get('value');
            this.element.innerText = new Date(val).toLocaleDateString(
            undefined, {year: 'numeric', day: 'numeric', month:'long'}
            );
        }
    });
})();