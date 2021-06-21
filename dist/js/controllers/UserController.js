class UserController {



    constructor(formId, tableId) {

        this.formE1 = document.getElementById(formId);
        this.tableE1 = document.getElementById(tableId);

        this.onSubmit();
    }

    onSubmit() {

        this.formE1.addEventListener("submit", event => {
            event.preventDefault();

            let btnSubmit = this.formE1.querySelector("[type=submit]");
            btnSubmit.disabled = true;

            let values = this.getValues();

            if (!values) return false;
            this.getPhoto().then(
                (content) => {
                    values.photo = content;

                    this.addLine(values);

                    this.formE1.reset();
                    btnSubmit.disabled = false;
                },
                (event) => {
                    console.error(event);
                });

        });

    }

    getPhoto() {

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            let elements = [...this.formE1.elements].filter(item => {
                if (item.name === 'photo') {
                    return item;
                }

            });

            let file = elements[0].files[0];

            fileReader.onload = () => {


                resolve(fileReader.result);
            }

            fileReader.onerror = (event) => {
                reject(event);
            }

            if (file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/boxed-bg.jpg');
            }

        });


    }

    getValues() {

        let user = {};
        let isValid = true;


        [...this.formE1.elements].forEach(function(field, index) {


            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {

                field.parentElement.classList.add('has-error');
                isValid = false;
            }

            if (field.name == "gender") {
                if (field.checked) {
                    user[field.name] = field.value;
                }
            } else if (field.name == "admin") {
                user[field.name] = field.checked;
            } else {
                user[field.name] = field.value;
            }

        });

        if (!isValid) {
            return false;
        }

        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );

    }

    addLine(dataUser) {

        let tr = document.createElement('tr');

        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin)? 'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;
        this.tableE1.appendChild(tr);
    }
}