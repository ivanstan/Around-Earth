var styles = [
    {
      "featureType":"all",
      "elementType":"labels",
      "stylers":[
        {"visibility":"off"}
      ]
    },
    { featureType: "road", stylers: [ { visibility: "off" } ] },
  { featureType: "transit", stylers: [ { visibility: "off" } ] },
  { featureType: "poi", stylers: [ { visibility: "off" } ] },
  //{ featureType: "landscape", stylers: [ { visibility: "off" } ] },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [
      { visibility: "off" }
    ]
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      { color: '#3646a7' } // dark blue
    ]
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [
      {
        color: '#4757bd', // lighter color on map
        //hue: '#00FFFF',
      }
    ]
  },
];
