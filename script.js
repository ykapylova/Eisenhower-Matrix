      let new_item = document.querySelector(".form_item")
      let checkbox__important = document.querySelector(".form_checkbox__important")
      let checkbox__urgently = document.querySelector(".form_checkbox__urgently")
      let new_item_button = document.querySelector(".form_button")

      let matrix = document.querySelector(".matrix")

      let text_container__important_urgently = document.querySelector(".matrix-element__important_urgently .matrix-element__items")
      let text_container__important_not_urgently = document.querySelector(".matrix-element__important_not_urgently .matrix-element__items")
      let text_container__unimportant_urgently = document.querySelector(".matrix-element__unimportant_urgently .matrix-element__items")
      let text_container__unimportant_not_urgently = document.querySelector(".matrix-element__unimportant_not_urgently .matrix-element__items")

      let reset__important_urgently = document.querySelector('.matrix-element__important_urgently .matrix-element__reset');
      let reset__important_not_urgently = document.querySelector('.matrix-element__important_not_urgently .matrix-element__reset');
      let reset__unimportant_urgently = document.querySelector('.matrix-element__unimportant_urgently .matrix-element__reset');
      let reset__unimportant_not_urgently = document.querySelector('.matrix-element__unimportant_not_urgently .matrix-element__reset');

      let array__important_urgently = {}
      let array__important_not_urgently = {}
      let array__unimportant_urgently = {}
      let array__unimportant_not_urgently = {}

      // Для "ловли" клика и перетаскивания
      let mouseDown = false;
      document.body.onmousedown = function() {
          mouseDown = true;
      }
      document.body.onmouseup = function() {
          mouseDown = false;
      }

      // нажатие на плюсик
      new_item_button.addEventListener('click', check_where_to_add_new_item)

      // нажатие на Enter
      new_item.addEventListener('keyup', function(event) {
          if (event.code === 'Enter') {
              event.preventDefault();
              check_where_to_add_new_item();
          }
      });

      // проверка, куда положить новый item
      function check_where_to_add_new_item() {
          if (checkbox__important.checked && checkbox__urgently.checked) {
              add_new_item(text_container__important_urgently, array__important_urgently)
          }
          if (!checkbox__important.checked && checkbox__urgently.checked) {
              add_new_item(text_container__unimportant_urgently, array__unimportant_urgently)
          }
          if (checkbox__important.checked && !checkbox__urgently.checked) {
              add_new_item(text_container__important_not_urgently, array__important_not_urgently)
          }
          if (!checkbox__important.checked && !checkbox__urgently.checked) {
              add_new_item(text_container__unimportant_not_urgently, array__unimportant_not_urgently)
          }
      }

      // клики по "refersh"
      reset__important_urgently.addEventListener("click", function() {
          reset_container(text_container__important_urgently, array__important_urgently)
      })
      reset__important_not_urgently.addEventListener("click", function() {
          reset_container(text_container__important_not_urgently, array__important_not_urgently)
      })
      reset__unimportant_urgently.addEventListener("click", function() {
          reset_container(text_container__unimportant_urgently, array__unimportant_urgently)
      })
      reset__unimportant_not_urgently.addEventListener("click", function() {
          reset_container(text_container__unimportant_not_urgently, array__unimportant_not_urgently)
      })

      // добавление нового item, навешивание всех обработчиков события
      function add_new_item(text_container, arr) {
          if (new_item.value.trim()) {
              let li = document.createElement('li')
              li.className = 'item'
              li.innerHTML = new_item.value;
              text_container.append(li)
              arr[li.innerHTML] = 'undone'

              li.ondragstart = function() {
                  return false;
              };

              // проверка клика или перетаскивания
              li.addEventListener('mousedown', function() {
                  setTimeout(function() {
                      // перенос item
                      if (mouseDown) {

                          li.ondragstart = function() {
                              return false;
                          };

                          li.onmousedown = function(e) {

                              let coords = getCoords(li);
                              let shiftX = e.pageX - coords.left;
                              let shiftY = e.pageY - coords.top;

                              li.style.position = 'absolute';
                              document.body.appendChild(li);
                              moveAt(e);

                              li.style.zIndex = 1000; // над другими элементами

                              function moveAt(e) {
                                  li.style.left = e.pageX - shiftX + 'px';
                                  li.style.top = e.pageY - shiftY + 'px';
                              }

                              document.onmousemove = function(e) {
                                  moveAt(e);
                              };

                              li.onmouseup = function(e) {

                                  drug_postion_check(text_container__important_urgently);
                                  drug_postion_check(text_container__important_not_urgently);
                                  drug_postion_check(text_container__unimportant_urgently);
                                  drug_postion_check(text_container__unimportant_not_urgently);

                                  function drug_postion_check(text_container) {
                                      if (e.pageX >= text_container.getBoundingClientRect().x &&
                                          e.pageX <= text_container.getBoundingClientRect().x + text_container.getBoundingClientRect().width &&
                                          e.pageY >= text_container.getBoundingClientRect().y &&
                                          e.pageY <= text_container.getBoundingClientRect().y + text_container.getBoundingClientRect().width) {
                                          text_container.append(li)
                                          li.style.position = 'static'
                                      }
                                  }
                              };

                          }

                          function getCoords(elem) { // кроме IE8-
                              var box = elem.getBoundingClientRect();
                              return {
                                  top: box.top + pageYOffset,
                                  left: box.left + pageXOffset
                              };
                          }
                          // перечеркивание или отчеркивание
                      } else {
                          if (li.style.textDecoration != "line-through") {
                              li.style.textDecoration = "line-through";
                              arr[li.innerHTML] = 'done'
                          } else {
                              li.style.textDecoration = "none"
                              arr[li.innerHTML] = 'undone'
                          }
                      }
                  }, 300)
              })

              new_item.value = '';
          }
      }

      // обновление контейнера
      function reset_container(text_container, arr) {
          text_container.innerHTML = "";
          for (let elem in arr) {
              if (arr[elem] == 'undone') {
                  let li = document.createElement('li')
                  li.innerHTML = elem;
                  li.addEventListener('click', function() {
                      if (li.style.textDecoration != "line-through") {
                          li.style.textDecoration = "line-through";
                          arr[li.innerHTML] = 'done'
                      } else {
                          li.style.textDecoration = "none"
                      }
                  })
                  text_container.append(li)
              } else {
                  delete arr[elem]
              }
          }
      }