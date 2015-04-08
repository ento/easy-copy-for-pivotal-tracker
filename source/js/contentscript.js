$(function() {
  chrome.extension.sendMessage({'action': 'pageStart'});
});

$(document).on('click', '.story', function(e){
  var id = $(this).attr('class').replace(/.*story_(\d+).*/,"$1");
  if (!id) { return; }
  var name = $(this).find('.story_name').text();
  var link = "https://www.pivotaltracker.com/story/show/" + id;

  var clip;
  if (e.metaKey && e.shiftKey) {
    clip = "[" + name + "](" + link + ")";
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
    $('ul.tn_flash_messages').html(
      $('<li>')
        .addClass('tn_flash_message tn_flash_flash tn_expiring_flash tn_sliding_list_item tn_sliding_list_fade-enter tn_sliding_list_fade-enter-active')
        .css({"word-break": "break-all"})
        .text(clip)
    )

    $('ul.tn_flash_messages').fadeIn(10).delay(1000).fadeOut(500, function() {
      $('ul.tn_flash_messages').html('')
    })

    chrome.extension.sendMessage({'text' : clip});
  }
});
