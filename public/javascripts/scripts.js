$(function() {

    function requestAJAX(data, url) {
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: url
        }).done( data => {
            if(!data.ok){
                console.log('ошибка');
                if(data.error === undefined){
                    data.error = 'Неизвестная ошибка';
                }

                $('form.sortMethods').prepend('<p class="error">' + data.error + '</p>')
            }else{
                $('.comment-list ul li').detach();

                data.comments.forEach( (item, index) =>{
                    $('.comment-list ul').append('<li id="' + item.id + '">\n' +
                        '            <div class="head">\n' +
                        '                <span>' + item.name + '</span>\n' +
                        '                <spam class="date">\n' +
                        '                    '+ data.moments[index] +'\n' +
                        '                </spam>\n' +
                        '                <br>\n' +
                        '            </div>\n' +
                        '            <a class="theme">Тема: '+ item.theme +'</a>\n' +
                        '            <br>\n' +
                        '            ' + item.body + '\n' +
                        '        </li>')
                });
            }
        });
    }

    // add form
    $('form.sortMethods .sortDate').on('click', function() {
        $('.error').detach();

        const data = {
            upperDate: $('input.checkUpperDate').is(':checked'),
            lowerDate: $('input.checkLowerDate').is(':checked')
        };

        requestAJAX(data, '/sort/sortToDate');

        return false;
    });

    // publish 1
    $('form.sortMethods .sortToLen').on('click', function() {
        $('.error').detach();

        const data = {
            upperLen: $('input.checkUpperLen').is(':checked'),
            lowerLen: $('input.checkLowerLen').is(':checked')
        };

        requestAJAX(data, '/sort/sortToLenText');

        return false;
    });

    $('form.sortMethods .sortCombine').on('click', function() {
        $('.error').detach();

        const data = {
            upperDate: $('input.checkUpperDate').is(':checked'),
            lowerDate: $('input.checkLowerDate').is(':checked'),
            upperLen: $('input.checkUpperLen').is(':checked'),
            lowerLen: $('input.checkLowerLen').is(':checked')
        };

        requestAJAX(data, '/sort/sortCombine');

        return false;
    });

});
$(function() {
    $('[data-toggle="datepicker"]').datepicker();


    function requestAJAX(data, url) {
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: url
        }).done( data => {
            if(!data.ok){
                if(data.error === undefined){
                    data.error = 'Неизвестная ошибка';
                }

                $('form.searchMetods').prepend('<p class="error">' + data.error + '</p>')
            }else{
                $('.comment-list ul li').detach();

                data.comments.forEach( (item, index) =>{
                    $('.comment-list ul').append('<li id="' + item.id + '">\n' +
                        '            <div class="head">\n' +
                        '                <span>' + item.name + '</span>\n' +
                        '                <spam class="date">\n' +
                        '                    '+ data.moments[index] +'\n' +
                        '                </spam>\n' +
                        '                <br>\n' +
                        '            </div>\n' +
                        '            <a class="theme">Тема: '+ item.theme +'</a>\n' +
                        '            <br>\n' +
                        '            ' + item.body + '\n' +
                        '        </li>')
                });
            }
        });
    }

    // add form
    $('form.searchMetods .addDate').on('click', function() {
        $('.error').detach();

        const currentDate = $('[data-toggle="datepicker"]').datepicker('getDate');
        const dateList = $('ul.dateList');
        const createDateStart = $('ul.dateList li.createDateStart');
        const createDateEnd = $('ul.dateList li.createDateEnd');

        if(createDateStart.val() !== undefined && createDateEnd.val() !== undefined){
            createDateStart.detach();
            createDateEnd.detach();
            dateList.append('<li class = "createDateStart">'+ currentDate.toString() + '</li>');
        }else{
            if (createDateStart.val() === undefined)
                dateList.append('<li class = "createDateStart">'+ currentDate.toString() + '</li>');
            else{
                if( new Date(createDateStart.text()) >= new Date(currentDate)){
                    $('form.searchMetods')
                        .prepend('<p class="error">Выбранная вами дата должна быть больше предыдущей</p>');
                }
                else{
                    dateList.append('<li class = "createDateEnd">'+ currentDate.toString() + '</li>');
                }
            }
        }

        return false;
    });

    $('form.searchMetods .searchForDate').on('click', function() {
        $('.error').detach();

        const createDateStart = $('ul.dateList li.createDateStart');
        const createDateEnd = $('ul.dateList li.createDateEnd');

        if(createDateStart.val() !== undefined && createDateEnd.val() !== undefined){
            const data = {
                createDateStart: createDateStart.text(),
                createDateEnd: createDateEnd.text()
            };
            requestAJAX(data, '/search/searchToDate');
        }else{
            $('form.searchMetods').prepend('<p class="error">Выберите диапазон значений дат</p>');
        }

        return false;
    });

    $('form.searchMetods .searchForText').on('click', function() {
        $('.error').detach();

        const text = $('form.searchMetods').find('input.textInput').val();

        if(text !== ''){
            var data = {
                text:text
            };
            requestAJAX(data, '/search/searchToText');
        }

        return false;
    });

    $('form.searchMetods .cancel').on('click', function() {
        $('.error').detach();

        $('[data-toggle="datepicker"]').datepicker('reset');
        $('form.searchMetods').find('input.textInput').val('');

        $('ul.dateList li.createDateStart').detach();
        $('ul.dateList li.createDateEnd').detach();

        requestAJAX({}, '/search/cancel');

        return false;
    });
});
$(function() {
    let commentForm;

    function requestAJAX(data, url) {
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: url
        }).done(function(data) {
            if(!data.ok){
                if(data.error === undefined){
                    data.error = 'Неизвестная ошибка';
                }

                $(commentForm).prepend('<p class="error">Ошибка ввода</p>')
            }else{
                $('.comment-list ul').append('<li id="' + data.comment.id + '">\n' +
                    '            <div class="head">\n' +
                    '                <span>' + data.comment.name +'</span>\n' +
                    '                <spam class="date">\n' +
                    '                    ' + data.moment +'\n' +
                    '                </spam>\n' +
                    '                <br>\n' +
                    '            </div>\n' +
                    '            <a class="theme" href="">Тема: ' + data.comment.theme + '</a>\n' +
                    '            <br>\n' +
                    '            ' + data.comment.body + '\n' +
                    '        </li>');
            }
        });
    }

    // add form
    $('#new, #reply').on('click', function() {
        if (commentForm) {
            commentForm.remove();
        }

        commentForm = $('.comment').clone(true, true);

        if ($(this).attr('id') === 'new') {
            commentForm.appendTo('.comment-list');
        }

        commentForm.css({ display: 'flex' });
    });

    // add form
    $('form.comment .cancel').on('click', function(e) {
        e.preventDefault();

        commentForm.remove();
    });

    // publish 1
    $('form.comment .send').on('click', function(e) {
        e.preventDefault();

        // removeErrors();
        var data = {
            name: commentForm.find('input.name').val(),
            theme: commentForm.find('input.theme').val(),
            body: commentForm.find('textarea.body').val()
        };

        requestAJAX(data, '/comment/add');
    });
});