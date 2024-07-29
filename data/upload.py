import argparse
import boto3
import os

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload a file to an S3 bucket")
    parser.add_argument("profile", type=str, help="AWS profile name")
    parser.add_argument("bucket", type=str, help="AWS S3 bucket name")
    parser.add_argument("file", type=str, help="The path to the file to upload")
    args = parser.parse_args()
    try:
        session = boto3.Session(profile_name=args.profile)
        s3 = session.client("s3")
        script_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(script_dir, args.file)
        key = os.path.basename(file_path)
        s3.upload_file(Filename=file_path, Bucket=args.bucket, Key=key)
        tags = [{"Key": "AllowExpiration", "Value": "false"}]
        s3.put_object_tagging(Bucket=args.bucket, Key=key, Tagging={"TagSet": tags})
    except Exception as e:
        print(f"An error occurred: {e}")
