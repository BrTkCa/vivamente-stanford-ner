module.exports = function(text) {
    if (text.indexOf('updated his profile picture') > -1 ||
        text.indexOf('updated hes profile picture') > -1) {
        return "profile_pic";
    }
    if (text.indexOf('updated his cover photo') > -1 ||
        text.indexOf('updated his cover photo') > -1) {
        return 'profile_cover';
    }
    if (text.indexOf('added a new photo — with') > -1 ||
        text.indexOf('new photos — with') > -1 ||
        text.indexOf('photo to the album') > -1) {
        return 'add_photo_with_others';
    }
    if (text.indexOf('added a new photo — with') > -1 ||
        text.indexOf('new photos — with') > -1 ||
        text.indexOf('photo to the album') > -1) {
        return 'add_photo_with';
    }
    if (text.indexOf('added a new photo') > -1 ||
        text.indexOf('new photos') > -1 ||
        text.indexOf('photo to the album') > -1) {
        return 'qtd_add_photo';
    }
    if (text.indexOf('feeling loved with') > -1) {
        return 'feel_love';
    }
    if (text.indexOf('feeling emocionado with') > -1) {
        return 'feel_emot';
    }
    if (text.indexOf('feeling thankful with') > -1) {
        return 'feel_thank';
    }
    if (text.indexOf('feeling blissful with') > -1) {
        return 'feel_bliss';
    }
    if (text.indexOf('feeling excited with') > -1) {
        return 'feel_excited';
    }
    if (text.indexOf('shared') > -1 &&
        text.indexOf('photo') > -1) {
        return 'shared_photo';
    }
    if (text.indexOf('shared') > -1 &&
        text.indexOf('video') > -1) {
        return 'shared_video';
    }
    if (text.indexOf('shared a link') > -1) {
        return 'shared_link';
    }
    if (text.indexOf('shared') > -1 &&
        text.indexOf('post') > -1) {
        return 'shared_post';
    }
    if (text.indexOf('shared a memory') > -1) {
        return 'shared_memmory';
    }
    if (text.indexOf('updated her status') > -1 ||
        text.indexOf('updated his status') > -1) {
        return 'update_status';
    }

    if (text.indexOf('a link to your timeline') > -1) {
        return 'timeline_link';
    }
    if (text.indexOf('in a relationship') > -1) {
        return 'in_relationship';
    }
    if (text.indexOf('added a life event from') > -1) {
        return 'life_event';
    }
    if (text.indexOf('recommends a video.') > -1) {
        return 'recommend_video';
    }
    if (text.indexOf('recommends a link') > -1) {
        return 'recommend_link';
    }
    if (text.indexOf('recommends an article on') > -1) {
        return 'recommend_article';
    }
    if (text.indexOf('shared a photo to your timeline') > -1) {
        return 'timeline_photo';
    }
    if (text.indexOf("shared a video to your timeline.") > -1) {
        return 'timeline_video';
    }
    if (text.indexOf('wrote on your timeline.') > -1) {
        return 'timeline_wrote';
    }
    return text;
}