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