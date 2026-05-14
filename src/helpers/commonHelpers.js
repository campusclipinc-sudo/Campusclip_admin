import moment from 'moment';

const defaultValue = (option, value) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return option ? option.find((opt) => opt.value === value) : '';
  } else if (Array.isArray(value)) {
    return option ? option.filter((opt) => value.includes(opt.value.toString())) : '';
  } else {
    return ''; // Handle cases where `value` is neither string, number, nor array
  }
};
const dateFormatCommon = () => {
  return 'MM-dd-yyyy';
};
const dateStringConvertDate = (date) => {
  if (!date) return '';
  let objectDate = new Date(date);
  let day = objectDate.getDate();

  let month = objectDate.getMonth() + 1;

  let year = objectDate.getFullYear();
  if (day < 10) {
    day = '0' + day;
  }

  if (month < 10) {
    month = `0${month}`;
  }

  return `${month}-${day}-${year}`;
};
const imagePreviewFormik = (file) => {
  const url =
    'data:image/png;base64,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';

  if (typeof file == 'string') {
    const extansion = file.split('.');
    if (extansion[1] !== 'pdf') {
      return file;
    } else {
      return url;
    }
  }
  const extansion = file.name.split('.');
  const imgUrl = URL.createObjectURL(file);
  if (extansion[extansion.length - 1] !== 'pdf') {
    return imgUrl;
  } else {
    return url;
  }
};
const defaultDateFormate = 'MM-DD-YYYY';
const dateFormat = 'MM/DD/YYYY';
const setFormatDate = (date) => {
  return date && date != ''
    ? moment(date.replace(/T/g, ' ').replace(/Z|z/g, '').split('.')[0] || '').format(
      defaultDateFormate
    )
    : null;
};
const fileToDataUri = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.readAsDataURL(file);
  });
const s3BucketFileUpload = async (file, type, uploadURL) => {
  let binary = atob(file.split(',')[1]);
  let array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  let blobData = new Blob([new Uint8Array(array)], {
    type: type,
  });
  const result = await fetch(uploadURL, {
    method: 'PUT',
    body: blobData,
  });
  return result;
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

export {
  defaultValue,
  dateFormatCommon,
  dateStringConvertDate,
  imagePreviewFormik,
  setFormatDate,
  fileToDataUri,
  s3BucketFileUpload,
  dateFormat,
  formatDate,
};
