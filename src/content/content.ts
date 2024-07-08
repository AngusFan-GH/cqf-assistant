
import injectScript from "../common/utils/inject-script";
import VideoCancelFullScreenFix from "./fix-full-screen";

new VideoCancelFullScreenFix();

injectScript({ file: 'content/record-video.js' });