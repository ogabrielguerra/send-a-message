class UserFeedback {
    constructor() {
        this.sendButton = document.getElementById("sendButton");
        this.sendMessage = document.getElementById("sendingMessage");
        this.feedbackMessage = document.getElementById("feedbackMessage");
        this.formContainer = document.getElementById("formContainer");
    }
    hideSendButton() {
        if (this.sendButton && this.sendMessage) {
            this.sendButton.style.display = 'none';
            this.sendMessage.style.display = 'block';
        }
    }
    statusMessage(message) {
        if (this.feedbackMessage && this.formContainer) {
            this.feedbackMessage.innerHTML = message;
            this.formContainer.style.display = 'none';
        }
    }
}
class SendAMessage {
    constructor(url, idiom = 'PT') {
        this.proceed = true;
        this.inputs = null;
        this.numInputs = 0;
        this.userFeedback = new UserFeedback();
        console.log('Initialized...');
        let element = document.getElementById('formContainer');
        this.idiom = idiom;
        if (typeof (element) != 'undefined' && element != null) {
            this.inputs = element.querySelectorAll('input, textarea');
            this.inputsList = Array.from(this.inputs);
            this.numInputs = this.inputs.length;
        }
        else {
            console.log('ERROR: No fields available.');
            console.log("test");
        }
        this.sendEmailMessage(url, '');
        this.proceed = true;
    }
    exists(element) {
        return (typeof (element) != 'undefined' && element != null);
    }
    highlight(input) {
        input.classList.add("form-error");
    }
    unsetHighlight(input) {
        input.classList.remove("form-error");
    }
    textInputHasValue(el) {
        return (this.exists(el)
            && el.type !== 'hidden'
            && (el.type === 'textarea' || el.type === 'text' || el.type === 'tel' || el.type === 'email')
            && el.value !== '');
    }
    validateInputs() {
        if (this.inputs) {
            this.inputsList.forEach((item) => {
                if (item.required && !this.textInputHasValue(item)) {
                    this.highlight(item);
                    this.proceed = false;
                }
                else {
                    this.unsetHighlight(item);
                }
            });
        }
    }
    showFeedback(errorOrSuccess, message) {
        if (errorOrSuccess === 'success') {
        }
    }
    buildFormData() {
        let fd = new FormData();
        this.inputsList.forEach((item) => {
            fd.append(item.name, item.value);
        });
        return fd;
    }
    setRequestAndSend(url, isUrlEncoded) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        if (isUrlEncoded) {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        xhr.send(this.buildFormData());
        return xhr;
    }
    sendEmailMessage(url, token) {
        if (!this.proceed || !this.exists(url)) {
            return false;
        }
        this.validateInputs();
        if (!this.proceed) {
            return false;
        }
        this.userFeedback.hideSendButton();
        const xhr = this.setRequestAndSend(url, false);
        const statusMessage = this.userFeedback.statusMessage;
        let messageSuccess = 'Mensagem enviada com sucesso!';
        let messageError = 'Houve um erro no envio se sua mensagem. Por favor, utilize um de nossos telefones.';
        if (this.idiom !== 'PT') {
            messageSuccess = 'Message sent!';
            messageError = 'An error occurred while trying to send your message. Please use one of our phones.';
        }
        new Promise((resolve) => {
            xhr.onreadystatechange = () => resolve(xhr);
        })
            .then(result => {
            (result.status == 200) ? statusMessage(messageSuccess) : statusMessage(messageError);
        })
            .catch(error => console.log('ERROR:', error.message));
    }
}
