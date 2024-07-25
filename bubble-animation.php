<?php
/**
 * Plugin Name: Bubble Animation
 * Plugin URI: https://github.com/NeuClix/bubble
 * Description: Adds a customizable bubble animation to your WordPress site.
 * Version: 1.0
 * Author: NeuClix
 * Author URI: http://neuclix.com
 */

// Enqueue scripts and styles
function bubble_animation_enqueue_scripts() {
    wp_enqueue_script('bubble-animation', plugin_dir_url(__FILE__) . 'js/bubble-animation.js', array(), '1.0', true);
    wp_enqueue_style('bubble-animation', plugin_dir_url(__FILE__) . 'css/bubble-animation.css');
}
add_action('wp_enqueue_scripts', 'bubble_animation_enqueue_scripts');

// Add bubble container to footer
function bubble_animation_add_container() {
    echo '<div id="bubble-container"><svg id="bubble-svg" width="100%" height="100%"></svg></div>';
}
add_action('wp_footer', 'bubble_animation_add_container');

// Add settings page
function bubble_animation_settings_page() {
    add_options_page('Bubble Animation Settings', 'Bubble Animation', 'manage_options', 'bubble-animation', 'bubble_animation_settings_page_html');
}
add_action('admin_menu', 'bubble_animation_settings_page');

// Settings page HTML
function bubble_animation_settings_page_html() {
    // Check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }
    
    // Save settings
    if (isset($_POST['bubble_animation_settings'])) {
        update_option('bubble_animation_num_bubbles', intval($_POST['num_bubbles']));
        update_option('bubble_animation_rise_rate', floatval($_POST['rise_rate']));
        update_option('bubble_animation_color', sanitize_hex_color($_POST['bubble_color']));
    }
    
    // Get current settings
    $num_bubbles = get_option('bubble_animation_num_bubbles', 20);
    $rise_rate = get_option('bubble_animation_rise_rate', 0.5);
    $bubble_color = get_option('bubble_animation_color', '#ADE6FF');
    
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <form action="" method="post">
            <table class="form-table">
                <tr>
                    <th scope="row">Number of Bubbles</th>
                    <td><input type="number" name="num_bubbles" value="<?php echo esc_attr($num_bubbles); ?>" min="1" max="100"></td>
                </tr>
                <tr>
                    <th scope="row">Rise Rate</th>
                    <td><input type="number" name="rise_rate" value="<?php echo esc_attr($rise_rate); ?>" min="0.1" max="5" step="0.1"></td>
                </tr>
                <tr>
                    <th scope="row">Bubble Color</th>
                    <td><input type="color" name="bubble_color" value="<?php echo esc_attr($bubble_color); ?>"></td>
                </tr>
            </table>
            <input type="hidden" name="bubble_animation_settings" value="1">
            <?php submit_button('Save Settings'); ?>
        </form>
    </div>
    <?php
}

// Pass settings to JavaScript
function bubble_animation_localize_script() {
    wp_localize_script('bubble-animation', 'bubbleAnimationSettings', array(
        'numBubbles' => get_option('bubble_animation_num_bubbles', 20),
        'riseRate' => get_option('bubble_animation_rise_rate', 0.5),
        'bubbleColor' => get_option('bubble_animation_color', '#ADE6FF')
    ));
}
add_action('wp_enqueue_scripts', 'bubble_animation_localize_script');