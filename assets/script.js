$(document).ready(function () {
    var toDo = {
        current: [], 
        done: [],
        deleted: []
    }
    var elems = {
        current: '<i class="fas fa-trash-alt deleteBtn"></i><i class="fas fa-pencil-alt editBtn"></i><i class="fas fa-check doneBtn"></i>', 
        done: '<i class="fas fa-trash-alt deleteBtn"></i><i class="fas fa-pencil-alt editBtn"></i>',
        deleted: '<i class="fas fa-trash-restore restoreBtn"></i>'
    }
    var activeTab = 'current';
    var id;
    var tbody = $('.table-body');
    var modal = $('.modal');
    var taskName = $('#task-name');
    var description = $('#task-description');
    var modalTitleItem = $('.modal .modal-title-item');
    var addBtn =  $('.addBtn');

    (function init(){
        if(localStorage.getItem('ToDo_list')){
            toDo = JSON.parse(localStorage.getItem('ToDo_list'));
        }
        createTable(toDo.current, elems.current);
    })();

    event();

    function event () {
        $('.nav-link.done').on('click', function(e) {
            e.preventDefault();
            activeNav.call(e.target, toDo.done, elems.done, 'done');
        })

        $('.nav-link.current').on('click', function(e) {
            e.preventDefault();
            activeNav.call(e.target, toDo.current, elems.current, 'current');
        })

        $('.nav-link.deleted').on('click', function(e) {
            e.preventDefault();
            activeNav.call(e.target, toDo.deleted, elems.deleted, 'deleted');
        })

        addBtn.on('click', function(e) {
            e.preventDefault();

            if (modalTitleItem.attr('data-state') === 'add') {
                id = toDo.current.length;
                addTask(toDo.current, elems.current, id);
                $('.nav-link.active').removeClass('active');
                $('.nav-link.current').addClass('active');
                activeTab = 'current';
            } else {
                addTask(toDo[activeTab], elems[activeTab], id);
            }
        })

        tbody.on('click', function (e) {
            if ($(e.target).hasClass('deleteBtn')) {
                move.call(e.target, toDo[activeTab], toDo.deleted, elems[activeTab]);
            } else if ($(e.target).hasClass('doneBtn')) {
                move.call(e.target, toDo.current, toDo.done, elems.current);
            } else if ($(e.target).hasClass('restoreBtn')) {
                move.call(e.target, toDo.deleted, toDo.current, elems.deleted);
            } else if ($(e.target).hasClass('editBtn')) {
                modal.modal('show')
                setState(modalTitleItem, 'edit');
                setState(addBtn, 'edit');
                id = $(e.target.closest('tr')).index();
                setValue(toDo[activeTab], id);
            }
        }) 

        modal.on('hidden.bs.modal', function (e) {
            setState(modalTitleItem, 'add');
            setState(addBtn, 'add');
            taskName.val('').removeClass('red');
        })
    }

    function createTable (data, elems) {
        tbody.empty();

        for (var i = 0; i < data.length; i++) {
        str = '<tr data-id=' + i + '><td>' + data[i].name + '</td><td>' + data[i].description + '</td><td>' + data[i].level + '</td><td>' + elems + '</td></tr>';
        tbody.append(str);
      }
    }

    function activeNav (data, elems, tab) {
        $('.nav-link.active').removeClass('active');
        $(this).addClass('active');
        createTable(data, elems);
        activeTab = tab;
    }

    function addTask(data, elems, id) { 
        if (!taskName.val()) {
            taskName.addClass('red');
            return;
        }

        var newTask = {};

        newTask.name = taskName.val();
        newTask.description = description.val();
        newTask.level = $('.radio-group input:checked').val();
        data.splice(id, 1, newTask);
        localStorage.setItem('ToDo_list', JSON.stringify(toDo));

        createTable(data, elems);
        id = '';
        description.val('');
        $('.unlimited').prop('checked', true);
        modal.modal('hide');
    }

    function move(arr1, arr2, elems) {
        var tr = this.closest('tr');
        var id = $(tr).index();
        var movedElem = arr1.splice(id, 1)[0];
        arr2.push(movedElem);
        localStorage.setItem('ToDo_list', JSON.stringify(toDo));
        createTable(arr1, elems);
    }

    function setValue (arr, id) {
        taskName.val(arr[id].name);
        description.val(arr[id].description);
        $('.radio-group input').each( function (i, el) {
            for (var i = 0; i < $('.radio-group input').length; i++) {
                if (arr[id].level === $(el).val()) {
                $(el).prop('checked', true);
                }
            }
        })  
    }

    function setState (elem, state) {
        elem.attr('data-state', state);
        if (state === 'add') {
            elem.text('Добавить');
        } else if (state === 'edit') {
            elem.text('Редактировать');
        }
    }
})