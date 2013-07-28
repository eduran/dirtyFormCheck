/**
 * Confirm Dirty Form
 *
 * A jquery plugin for detecting dirty forms and displaying a 'confirm' message if a form is dirty.
 * Takes default values into account whereas a form is considered undirty if form contains all default values
 */
(function($) {

    $.settings = {
        formDirty:    false,
        defaultKey:     'defaultVal',
        formTagNames:   'input,select,textarea',
        formEvtActions: 'onkeyup change'
    };

    /**
     * Behaves as a controller for plugin. Looks for and sets default elements for each user
     * input element, attaches event handlers, and handles confirmation box display
     *
     */
    $.fn.confirmDirtyForm = function() {

        var elForm;

        return this.each(function() {
            elForm = this;

            // Cycle through each input element to find any default values
            $(this).find($.settings.formTagNames).each( function(){
                var defaultVal = getValueByType(this);
                $.data(this, $.settings.defaultKey,defaultVal);
            });

            // Assign event handlers to input elements. Check last interacted element for dirtiness
            $(this).find($.settings.formTagNames).on('keyup change',function(eventObj){
                $.settings.formDirty = isElementDirty(this);
            });

            // Checks if entire form is dirty to determine whether confirm box is displayed upon user leaving
            $(window).on('beforeunload',function(){
                if(isFormDirty(elForm) == true)
                {
                    return 'There is unsaved data on the page.';
                }
            });

        });

    };

    /**
     * Checks the element type and returns it's proper value
     * Returns false in some cases if element value is invalid based on it's type
     *
     * @param element   Element object
     * @returns {boolean}|{string}
     */
    function getValueByType(element)
    {
        var elTagName = element.tagName.toLowerCase(),
            value = false,
            elObj;

        switch(elTagName)
        {
            case 'input':
                switch(element.type)
                {
                    case 'radio':
                    case 'checkbox':
                        // If a checkbox isn't checked, this value is invalid. Return false.
                        elObj = (element.checked) ? element : false;
                        break;
                    default:
                        elObj = element;

                }
                break;
            case 'select':
                // Find the selected option value within a select list
                elObj = element.options[element.selectedIndex];
                break;
            case 'textarea':
                elObj = element;
                break;
        }

        value = (elObj != false) ? elObj.value : false;

        return value;
    }

    /**
     * Checks if element is dirty by comparing it to its default value
     *
     * @param elementObj    Element Object
     * @returns {boolean}
     */
    function isElementDirty(elementObj)
    {
        return (getValueByType(elementObj) != $.data(elementObj, $.settings.defaultKey))
    }

    /**
     * Checks if any element in the form is dirty
     *
     * @param form  Form Object
     * @returns {boolean}
     */
    function isFormDirty(form)
    {
        var formDirty = false;

        // If the last interacted form element is dirty, we don't need to check the entire form
        if($.settings.formDirty == true)
        {
            return true;
        }
        else
        {
            // Cycles through all form elements and determines if any are dirty
            $(form).find($.settings.formTagNames).each(function(){
                formDirty = isElementDirty(this);

                // If one element is dirty, then the form is dirty.
                if(formDirty == true)
                {
                    $.settings.formDirty = true;
                    return false;
                }
            });
        }

        return formDirty;
    }

}(jQuery));