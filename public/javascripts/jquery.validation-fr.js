/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: FR
 */
$(function(){
    if($.validator){
        jQuery.extend(jQuery.validator.messages, {
                required: "Saisir un nom de champ.",
                remote: "Veuillez remplir ce champ pour continuer.",
                email: "Veuillez entrer une adresse email valide.",
                url: "Veuillez entrer une URL valide.",
                date: "Veuillez entrer une date valide.",
                dateISO: "Veuillez entrer une date valide (ISO).",
                number: "Veuillez entrer un nombre valide.",
                digits: "Veuillez entrer (seulement) une valeur numГ©rique.",
                creditcard: "Veuillez entrer un numГ©ro de carte de crГ©dit valide.",
                equalTo: "Veuillez entrer une nouvelle fois la mГЄme valeur.",
                accept: "Veuillez entrer une valeur avec une extension valide.",
                maxlength: jQuery.validator.format("Veuillez ne pas entrer plus de {0} caractГЁres."),
                minlength: jQuery.validator.format("Veuillez entrer au moins {0} caractГЁres."),
                rangelength: jQuery.validator.format("Veuillez entrer entre {0} et {1} caractГЁres."),
                range: jQuery.validator.format("Veuillez entrer une valeur entre {0} et {1}."),
                max: jQuery.validator.format("Veuillez entrer une valeur infГ©rieure ou Г©gale Г  {0}."),
                min: jQuery.validator.format("Veuillez entrer une valeur supГ©rieure ou Г©gale Г  {0}.")
        });
    }
});
