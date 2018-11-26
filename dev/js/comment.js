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