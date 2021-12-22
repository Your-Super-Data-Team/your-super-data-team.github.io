// Main selectors
const formElement = document.querySelector('#nameInfo')
const formElementEmail = document.querySelector('#nameInfoEmail')
const output = document.querySelector('#output')
const output_code = document.querySelector('#output_code')
// For the Ad Group
const row_adgroup = document.querySelector('#row_adgroup')
const output_adgroup = document.querySelector('#output_adgroup')
const output_code_adgroup = document.querySelector('#output_code_adgroup')
// For the UTM Tag
const output_code_utm = document.querySelector('#output_code_utm')
// For the Ad Name
const output_ad = document.querySelector('#output_ad')
const output_code_ad = document.querySelector('#output_code_ad')
// For the email Flow
const output_flow = document.querySelector('#output_flow')
const output_code_flow = document.querySelector('#output_code_flow')

// Reference Information
const utm_source_map = {
  FB: 'facebook',
  GOOGL: 'google',
  BNG: 'bing',
  YT: 'youtube',
  PIN: 'pinterest',
  Criteo: 'criteo',
  TT: 'tiktok',
  Acuity: 'acuity'
}

// Helper Functions
function clean (given_string) {
  return _.upperFirst(_.camelCase(given_string).replace(/_|\s/gi, ''))
}
function dash_lower (given_string) {
  return _.snakeCase(given_string).replace(/_/gi, '-')
}
function maybe_add_trailing_slash (url) {
  var lastChar = url.substr(-4) // Selects the last character
  if (lastChar == '.com') {
    // If the last character is not a slash
    url = url + '/' // Append a slash to it.
  }
  return url
}
function adgroup_name (product_category_raw, audience_raw, is_experiment_raw) {
  var name_adgroup = ``
  if (product_category_raw || audience_raw || is_experiment_raw) {
    name_adgroup =
      name_adgroup + clean(product_category_raw) + '_' + clean(audience_raw)
  }
  if (is_experiment_raw.length > 0) {
    name_adgroup = name_adgroup + '_' + is_experiment_raw
  }
  return name_adgroup
}
function maybe_term (channel_raw, audience_raw) {
  // return term value if this isn't paid search
  if (channel_raw == 'PaidSearch' || audience_raw.length == 0) {
    return ''
  } else {
    return `&utm_term=${dash_lower(audience_raw)}`
  }
}
function maybe_utm_content (utm_content_raw, ad_image_name, ad_copy_name) {
  let content =
    utm_content_raw.length == 0
      ? ''.concat(dash_lower(ad_image_name), '--', dash_lower(ad_copy_name))
      : dash_lower(utm_content_raw)
  if (content.length == 0 || content == '--') {
    return ''
  } else {
    return `&utm_content=${content}`
  }
}
function build_image_video_name (ad_image_name, ad_video_length) {
  var image_video_name = clean(ad_image_name)
  if (ad_video_length.length > 0) {
    image_video_name = image_video_name + '-' + ad_video_length + 's'
  }
  return image_video_name
}

// Full Update functions
function updateValue (e) {
  // Form values
  let channel_raw = formElement.elements['channel'].value
  let region_raw = formElement.elements['region'].value
  let platform_raw = formElement.elements['platform'].value
  let tactic_raw = formElement.elements['tactic'].value
  // Related to Ad Group / Ad Set
  let product_category_raw = formElement.elements['productCategory'].value
  let audience_raw = formElement.elements['audience'].value
  let is_experiment_raw = formElement.elements['is_experiment'].checked
    ? 'Exp'
    : ''
  // Related to UTM tags
  let landing_page_raw = formElement.elements['landingPage'].value
  let utm_content_raw = formElement.elements['utmContent'].value
  // Related to ad name
  let ad_content_type = formElement.elements['ad_content_type'].value
  let ad_language = formElement.elements['ad_language'].value
  let target_country = formElement.elements['target_country'].value
  let ad_content_focus = formElement.elements['ad_content_focus'].value
  let ad_image_name = formElement.elements['ad_image_name'].value
  let ad_copy_name = formElement.elements['ad_copy_name'].value
  let ad_destination_name = formElement.elements['ad_destination_name'].value
  let ad_destination_type = formElement.elements['ad_destination_type'].value
  let ad_tactic = formElement.elements['ad_tactic'].value
  let ad_note = formElement.elements['ad_note'].value
  let ad_video_length = formElement.elements['ad_video_length'].value

  // Build Campaign & Ad Group
  let campaign_name_base = `${channel_raw}_${region_raw}_${platform_raw}_${tactic_raw}`
  let name_adgroup_raw = adgroup_name(
    product_category_raw,
    audience_raw,
    is_experiment_raw
  )

  if (name_adgroup_raw.length > 0) {
    // row_adgroup.hidden = false;
    var campaign_name = `${campaign_name_base}_${name_adgroup_raw}_C1`
  } else if (name_adgroup_raw.length == 0) {
    // row_adgroup.hidden = true;
    var campaign_name = `${campaign_name_base}_C1`
  }

  let name_adgroup = `${name_adgroup_raw}_${target_country}`

  // Build Ad Name
  // let ad_name_base = `${ad_content_type}_${clean(ad_content_focus)}_${clean(ad_image_name)}_${clean(ad_copy_name)}_${clean(ad_destination_name)}_${ad_destination_type}_${ad_language}_${clean(ad_note)}_YS1`
  let ad_name_base = `${ad_content_type}_${clean(
    ad_content_focus
  )}_${build_image_video_name(ad_image_name, ad_video_length)}_${clean(
    ad_copy_name
  )}_${clean(
    ad_destination_name
  )}_${ad_destination_type}_${ad_language}_${ad_tactic}_${clean(ad_note)}_YS2`

  // Display Campaign and AdGroup Name
  output.textContent = campaign_name
  output_code.value = campaign_name
  output_adgroup.textContent =
    name_adgroup.length > 0 ? name_adgroup : 'No Product or Audience Defined'
  output_code_adgroup.value = name_adgroup

  // Display Ad Name
  output_ad.textContent = ad_name_base
  output_code_ad.value = ad_name_base

  // Build UTM
  link_utm = `${maybe_add_trailing_slash(
    landing_page_raw
  )}?utm_source=${dash_lower(
    utm_source_map[platform_raw]
  )}&utm_medium=${dash_lower(
    channel_raw
  )}&utm_campaign=${campaign_name}${maybe_term(
    channel_raw,
    audience_raw
  )}${maybe_utm_content(utm_content_raw, ad_image_name, ad_copy_name)}`
  output_code_utm.value = link_utm
}
function updateValueEmail (e) {
  // Values
  let audience_raw = formElementEmail.elements['audience'].value
  let campaign_type_raw = formElementEmail.elements['campaign_type'].value
  let date_raw = formElementEmail.elements['date'].value
  let is_resend_raw = formElementEmail.elements['is_resend'].checked
    ? 'Resend'
    : ''
  let topic_raw = formElementEmail.elements['topic'].value
  let note_raw = formElementEmail.elements['note'].value

  let flow_trigger_raw = formElementEmail.elements['flow_trigger'].value
  let flow_topic_raw = formElementEmail.elements['flow_topic'].value
  let flow_number_raw = formElementEmail.elements['flow_order'].value

  // Build Campaign and flow name
  let campaign_name = `${audience_raw}_${campaign_type_raw}_${clean(
    topic_raw
  )}_${date_raw}_${is_resend_raw}_${clean(note_raw)}_E1`
  output.textContent = campaign_name
  output_code.value = campaign_name

  let flow_name = `${flow_trigger_raw}_${clean(
    flow_topic_raw
  )}_${flow_number_raw}_F1`
  output_flow.textContent = flow_name
  output_code_flow.value = flow_name
}

// Set starting values
if (!(document.getElementById('date') === null)) {
  document.getElementById('date').valueAsDate = new Date()
}
// Setup
if (!(formElement === null)) {
  formElement.addEventListener('change', updateValue)
  updateValue()
}
if (!(formElementEmail === null)) {
  formElementEmail.addEventListener('change', updateValueEmail)
  updateValueEmail()
}
