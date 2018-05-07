$(function() {
  chrome.extension.sendMessage({'action': 'pageStart'});
  htmlClipboard = new HtmlClipboard();
});

function HtmlClipboard() {
  var div = document.createElement('div');
  div.style.fontSize = '12pt'; // Prevent zooming on iOS
  // Reset box model
  div.style.border = '0';
  div.style.padding = '0';
  div.style.margin = '0';
  // Move element out of screen
  div.style.position = 'fixed';
  div.style['right'] = '-9999px';
  div.style.top = (window.pageYOffset || document.documentElement.scrollTop) + 'px';
  // more hiding
  div.setAttribute('readonly', '');
  div.style.opacity = 0;
  div.style.pointerEvents = 'none';
  div.style.zIndex = -1;
  div.setAttribute('tabindex', '0'); // so it can be focused
  div.innerHTML = '';
  document.body.appendChild(div);
  this.div = div;
}

HtmlClipboard.prototype.copy = function(html) {
  this.div.innerHTML = html;

  var focused = document.activeElement;
  this.div.focus();

  window.getSelection().removeAllRanges();
  var range = document.createRange();
  range.setStartBefore(this.div.firstChild);
  range.setEndAfter(this.div.lastChild);
  window.getSelection().addRange(range);

  return new Promise(function(resolve, reject) {
    try {
      if (document.execCommand('copy')) {
        resolve();
      } else {
        reject('execCommand returned false !');
      }
    } catch (err) {
      reject(err);
    } finally {
      if (focused) {
        focused.focus();
      }
    }
  });
}

var CopyEffects = {
  text: function(payload) {
    return navigator.clipboard.writeText(payload);
  },
  html: function(payload) {
    if (typeof navigator.clipboard.write === 'function') {
      var data = new DataTransfer();
      data.setData('text/html', payload);
      return navigator.clipboard.write(data);
    } else {
      return htmlClipboard.copy(payload);
    }
  }
};

$(document).on('click', '.story', function(e){
  var id = $(this).attr('class').replace(/.*story_(\d+).*/,"$1");
  if (!id) { return; }
  var name = $(this).find('.story_name').text();
  if (!name) {
    name = $(this).find('[name=story\\[name\\]]').val();
  }
  var link = "https://www.pivotaltracker.com/story/show/" + id;
  var type = "text";

  var clip;
  if (e.metaKey && e.shiftKey) {
    clip = "[" + name + "](" + link + ")";
  } else if (e.ctrlKey && e.shiftKey) {
    clip = '<a href="' + link + '">' + name + "</a>";
    type = "html";
  } else if (e.metaKey && e.altKey) {
    clip = name + " #" + id;
  } else if (e.altKey) {
    clip = id;
  } else if (e.shiftKey) {
    clip = link;
  } else if (e.metaKey) {
    clip = name;
  }

  if (clip) {
    CopyEffects[type](clip).then(function() {
      $('ul.tn_flash_messages').html(
        $('<li>')
          .addClass('tn_flash_message tn_flash_flash tn_expiring_flash tn_sliding_list_item tn_sliding_list_fade-enter tn_sliding_list_fade-enter-active')
          .css({"word-break": "break-all"})
          .text(clip)
      )

      $('ul.tn_flash_messages').fadeIn(10).delay(1000).fadeOut(500, function() {
        $('ul.tn_flash_messages').html('')
      })
    });
  }
});
