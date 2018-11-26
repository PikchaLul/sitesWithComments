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