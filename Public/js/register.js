document.addEventListener('DOMContentLoaded', function(){
    let name = document.getElementById('nom');
    let email = document.getElementById('email');
    let pass = document.getElementById('pass');
    let invalid_pass = document.getElementById('invalid_pass');
    let btn_send = document.getElementById('send_button');

    let grid = document.createElement('div')
    grid.classList='d-grid gap-2';

    let pass_valid = false;
    let email_valid = false;

    pass.addEventListener('input', verify_pass);
    name.addEventListener('input', add_button);
    email.addEventListener('change', verify_email);

    function verify_pass(event){
        if(pass.value.length < 8){
            event.preventDefault();
            pass.classList.add('is-invalid');
            invalid_pass.style.display = 'block';
            pass_valid = false;
        }else{
            pass.classList.remove('is-invalid');
            pass.classList.add('is-valid');
            invalid_pass.style.display = 'none';
            pass_valid = true;
        }

        if(pass.value.length == 0){
            pass.classList.remove('is-invalid');
            pass.classList.remove('is-valid');
            invalid_pass.style.display = 'none';
            pass_valid = false;
        }
        add_button();
    }

    function add_button(){
        if(pass_valid && name.value !== '' && email_valid){
            grid.innerHTML=`
            <button type="submit" class="btn btn-dark">
              <i class="bi bi-send-plus"> &nbsp; </i> Enviar
            </button>
            `;
            btn_send.appendChild(grid);
        }else{
            grid.innerHTML=``;
            btn_send.appendChild(grid);
        }
    }

    function verify_email(event){
        event.preventDefault();
        let array_mail = email.value;
        let hasAt = false; // Variable para rastrear si se encontró el '@'
        array_mail = array_mail.split('');
        if(email.value.length == ''){
            email.classList.remove('is-valid');
            email.classList.remove('is-invalid');
            email_valid = false;
        } else {
            array_mail.forEach(element => {
                if(element === '@'){
                    hasAt = true;
                } else if (element === ' ' || element === '' || element === null) {
                    // Si hay un espacio en blanco o una cadena vacía después del '@', es inválido
                    hasAt = false;
                }
            });
            if (hasAt) {
                email.classList.remove('is-invalid');
                email.classList.add('is-valid');
                email_valid = true;
            } else {
                email.classList.remove('is-valid');
                email.classList.add('is-invalid');
                email_valid = false;
            }
        }
        add_button();
    }
    
});
