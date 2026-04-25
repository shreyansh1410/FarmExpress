const INDIAN_STATES_CITIES = [
  { state: "Andhra Pradesh", cities: ["Visakhapatnam", "Vijayawada", "Tirupati", "Kakinada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Anantapur", "Kadapa"] },
  { state: "Arunachal Pradesh", cities: ["Itanagar", "Naharlagun", "Tawang", "Pasighat", "Ziro", "Bomdila"] },
  { state: "Assam", cities: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tezpur", "Tinsukia", "Bongaigaon"] },
  { state: "Bihar", cities: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Purnia", "Darbhanga", "Ara", "Begusarai", "Katihar", "Munger"] },
  { state: "Chhattisgarh", cities: ["Raipur", "Bilaspur", "Durg", "Bhilai", "Korba", "Rajnandgaon", "Jagdalpur", "Ambikapur"] },
  { state: "Goa", cities: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"] },
  { state: "Gujarat", cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Anand", "Morbi"] },
  { state: "Haryana", cities: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula"] },
  { state: "Himachal Pradesh", cities: ["Shimla", "Dharamshala", "Mandi", "Solan", "Kullu", "Hamirpur"] },
  { state: "Jharkhand", cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Ramgarh"] },
  { state: "Karnataka", cities: ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Davanagere", "Ballari", "Shivamogga", "Tumakuru", "Udupi", "Vijayapura"] },
  { state: "Kerala", cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Kannur", "Alappuzha", "Palakkad", "Kottayam", "Malappuram"] },
  { state: "Madhya Pradesh", cities: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Satna", "Ratlam", "Rewa", "Dewas"] },
  { state: "Maharashtra", cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Nanded", "Jalgaon", "Akola"] },
  { state: "Manipur", cities: ["Imphal", "Thoubal", "Bishnupur", "Churachandpur"] },
  { state: "Meghalaya", cities: ["Shillong", "Tura", "Jowai", "Nongstoin"] },
  { state: "Mizoram", cities: ["Aizawl", "Lunglei", "Champhai", "Saiha"] },
  { state: "Nagaland", cities: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"] },
  { state: "Odisha", cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Berhampur", "Balasore", "Puri", "Baripada"] },
  { state: "Punjab", cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur", "Pathankot", "Moga"] },
  { state: "Rajasthan", cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bharatpur", "Sikar", "Pali"] },
  { state: "Sikkim", cities: ["Gangtok", "Namchi", "Gyalshing", "Mangan"] },
  { state: "Tamil Nadu", cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul", "Thanjavur"] },
  { state: "Telangana", cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Mahbubnagar", "Suryapet"] },
  { state: "Tripura", cities: ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar"] },
  { state: "Uttar Pradesh", cities: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Prayagraj", "Meerut", "Ghaziabad", "Noida", "Aligarh", "Bareilly", "Gorakhpur", "Jhansi", "Moradabad", "Saharanpur", "Mathura"] },
  { state: "Uttarakhand", cities: ["Dehradun", "Haridwar", "Rishikesh", "Haldwani", "Roorkee", "Kashipur", "Rudrapur"] },
  { state: "West Bengal", cities: ["Kolkata", "Siliguri", "Durgapur", "Asansol", "Howrah", "Kharagpur", "Malda", "Bardhaman"] },
  { state: "Delhi", cities: ["New Delhi", "Delhi", "Dwarka", "Rohini", "Karol Bagh"] },
  { state: "Jammu and Kashmir", cities: ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Pulwama"] },
  { state: "Ladakh", cities: ["Leh", "Kargil"] },
  { state: "Andaman and Nicobar Islands", cities: ["Port Blair", "Diglipur", "Mayabunder"] },
  { state: "Chandigarh", cities: ["Chandigarh"] },
  { state: "Dadra and Nagar Haveli and Daman and Diu", cities: ["Daman", "Silvassa", "Diu"] },
  { state: "Lakshadweep", cities: ["Kavaratti", "Agatti", "Amini"] },
  { state: "Puducherry", cities: ["Puducherry", "Karaikal", "Mahe", "Yanam"] },
];

const CITY_COORDINATES = {
  "visakhapatnam|andhra pradesh": { lat: 17.6868, lng: 83.2185 },
  "vijayawada|andhra pradesh": { lat: 16.5062, lng: 80.648 },
  "guwahati|assam": { lat: 26.1445, lng: 91.7362 },
  "patna|bihar": { lat: 25.5941, lng: 85.1376 },
  "raipur|chhattisgarh": { lat: 21.2514, lng: 81.6296 },
  "ahmedabad|gujarat": { lat: 23.0225, lng: 72.5714 },
  "surat|gujarat": { lat: 21.1702, lng: 72.8311 },
  "gurugram|haryana": { lat: 28.4595, lng: 77.0266 },
  "ranchi|jharkhand": { lat: 23.3441, lng: 85.3096 },
  "bengaluru|karnataka": { lat: 12.9716, lng: 77.5946 },
  "mysuru|karnataka": { lat: 12.2958, lng: 76.6394 },
  "thiruvananthapuram|kerala": { lat: 8.5241, lng: 76.9366 },
  "kochi|kerala": { lat: 9.9312, lng: 76.2673 },
  "bhopal|madhya pradesh": { lat: 23.2599, lng: 77.4126 },
  "indore|madhya pradesh": { lat: 22.7196, lng: 75.8577 },
  "mumbai|maharashtra": { lat: 19.076, lng: 72.8777 },
  "pune|maharashtra": { lat: 18.5204, lng: 73.8567 },
  "nagpur|maharashtra": { lat: 21.1458, lng: 79.0882 },
  "hyderabad|telangana": { lat: 17.385, lng: 78.4867 },
  "chennai|tamil nadu": { lat: 13.0827, lng: 80.2707 },
  "coimbatore|tamil nadu": { lat: 11.0168, lng: 76.9558 },
  "lucknow|uttar pradesh": { lat: 26.8467, lng: 80.9462 },
  "kanpur|uttar pradesh": { lat: 26.4499, lng: 80.3319 },
  "agra|uttar pradesh": { lat: 27.1767, lng: 78.0081 },
  "varanasi|uttar pradesh": { lat: 25.3176, lng: 82.9739 },
  "dehradun|uttarakhand": { lat: 30.3165, lng: 78.0322 },
  "kolkata|west bengal": { lat: 22.5726, lng: 88.3639 },
  "new delhi|delhi": { lat: 28.6139, lng: 77.209 },
  "delhi|delhi": { lat: 28.7041, lng: 77.1025 },
  "srinagar|jammu and kashmir": { lat: 34.0837, lng: 74.7973 },
};

const LOCATION_LOOKUP = new Map();
INDIAN_STATES_CITIES.forEach(({ state, cities }) => {
  cities.forEach((city) => {
    const key = `${city.toLowerCase()}|${state.toLowerCase()}`;
    const coords = CITY_COORDINATES[key] || {};
    LOCATION_LOOKUP.set(key, { state, name: city, ...coords });
  });
});

const parseIndianLocation = (value = "") => {
  const [cityRaw, ...stateParts] = String(value).split(",");
  const city = cityRaw?.trim();
  const state = stateParts.join(",").trim();
  if (!city || !state) return null;
  return { city, state };
};

const formatIndianLocation = (city, state) => `${city}, ${state}`;

const getLocationKey = ({ city, state }) => `${city.toLowerCase()}|${state.toLowerCase()}`;

const normalizeIndianLocation = (value = "") => {
  const parsed = parseIndianLocation(value);
  if (!parsed) return null;
  const match = LOCATION_LOOKUP.get(getLocationKey(parsed));
  if (!match) return null;
  return formatIndianLocation(match.name, match.state);
};

const isValidIndianLocation = (value = "") => Boolean(normalizeIndianLocation(value));

const getIndianLocationCoordinates = (value = "") => {
  const parsed = parseIndianLocation(value);
  if (!parsed) return null;
  const match = LOCATION_LOOKUP.get(getLocationKey(parsed));
  if (!match) return null;
  return { lat: match.lat, lng: match.lng, city: match.name, state: match.state };
};

module.exports = {
  INDIAN_STATES_CITIES,
  parseIndianLocation,
  formatIndianLocation,
  normalizeIndianLocation,
  isValidIndianLocation,
  getIndianLocationCoordinates,
};
